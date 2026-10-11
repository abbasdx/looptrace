package com.looptrace.service;

import com.looptrace.model.PhotoObject;
import com.looptrace.repository.PhotoObjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class S3PhotoService {
    private final PhotoObjectRepository objects;
    @Value("${looptrace.storage.bucket:}") private String bucket;
    @Value("${looptrace.storage.region:ap-south-1}") private String region;

    public boolean configured() {
        return !bucket.isBlank();
    }

    public PhotoObject store(MultipartFile file, String ownerUserId) throws IOException {
        if (!configured()) throw new IllegalStateException("Photo storage is not configured");
        String key = "photos/" + ownerUserId + "/" + UUID.randomUUID();
        String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
        try (S3Client client = S3Client.builder().region(Region.of(region)).build()) {
            client.putObject(PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType)
                    .serverSideEncryption("AES256").build(), RequestBody.fromBytes(file.getBytes()));
        }
        byte[] content = file.getBytes();
        String checksum;
        try {
            checksum = java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content));
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
        PhotoObject object = PhotoObject.builder().key(key).ownerUserId(ownerUserId)
                .contentType(contentType).size(file.getSize()).checksum(checksum)
                .createdAt(Instant.now()).build();
        return objects.save(object);
    }

    public String presignedUrl(PhotoObject object) {
        try (S3Presigner presigner = S3Presigner.builder().region(Region.of(region)).build()) {
            GetObjectRequest get = GetObjectRequest.builder().bucket(bucket).key(object.getKey()).build();
            GetObjectPresignRequest request = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10)).getObjectRequest(get).build();
            return presigner.presignGetObject(request).url().toString();
        }
    }
}

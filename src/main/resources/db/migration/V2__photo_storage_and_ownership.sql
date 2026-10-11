alter table pickup_request add column if not exists owner_user_id varchar(255);

create table if not exists app_user (
    id varchar(255) primary key,
    email varchar(320) not null unique,
    password_hash varchar(255) not null,
    role varchar(32) not null,
    participant_id varchar(255),
    enabled boolean not null
);

create table if not exists photo_object (
    object_key varchar(512) primary key,
    owner_user_id varchar(255) not null,
    content_type varchar(255) not null,
    size bigint not null,
    checksum varchar(128),
    created_at timestamp
);

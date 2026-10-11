create table collector (
    id varchar(255) primary key,
    version bigint not null default 0,
    name varchar(255),
    latitude double precision not null,
    longitude double precision not null,
    status varchar(32),
    demo boolean not null
);

create table recycler (
    id varchar(255) primary key,
    name varchar(255),
    registration_reference varchar(255),
    latitude double precision not null,
    longitude double precision not null,
    verified boolean not null,
    status varchar(32),
    demo boolean not null
);

create table participant (
    id varchar(255) primary key,
    role varchar(32),
    name varchar(255),
    email varchar(255),
    phone varchar(255),
    registration_reference varchar(255),
    latitude double precision not null,
    longitude double precision not null,
    status varchar(32),
    verified boolean not null,
    demo boolean not null,
    created_at timestamp
);

create table participant_application (
    id varchar(255) primary key,
    role varchar(32),
    name varchar(255),
    email varchar(255),
    phone varchar(255),
    registration_reference varchar(255),
    latitude double precision not null,
    longitude double precision not null,
    status varchar(32),
    demo boolean not null,
    created_at timestamp
);

create table pickup_request (
    id varchar(255) primary key,
    version bigint not null default 0,
    household_name varchar(255),
    owner_user_id varchar(255),
    demo boolean not null,
    material_category varchar(255),
    estimated_weight_kg double precision not null,
    weight_note varchar(255),
    pickup_area varchar(255),
    latitude double precision not null,
    longitude double precision not null,
    photo_key varchar(255),
    ai_result varchar(255),
    safety_guidance varchar(255),
    collector_id varchar(255),
    distance_km double precision,
    status varchar(32),
    created_at timestamp,
    actual_weight_kg double precision,
    recycler_id varchar(255),
    handed_off_at timestamp
);

create table app_user (
    id varchar(255) primary key,
    email varchar(320) not null unique,
    password_hash varchar(255) not null,
    role varchar(32) not null,
    participant_id varchar(255),
    enabled boolean not null
);

create table photo_object (
    object_key varchar(512) primary key,
    owner_user_id varchar(255) not null,
    content_type varchar(255) not null,
    size bigint not null,
    checksum varchar(128),
    created_at timestamp
);

create table custody_event (
    id varchar(255) primary key,
    request_id varchar(255),
    sequence integer not null,
    step varchar(255),
    actor varchar(255),
    weight_kg double precision,
    photo_key varchar(255),
    timestamp timestamp,
    previous_hash varchar(255),
    hash varchar(255)
);

create table collector_categories (
    collector_id varchar(255) not null,
    accepted_categories varchar(255),
    primary key (collector_id, accepted_categories)
);

create table recycler_categories (
    recycler_id varchar(255) not null,
    accepted_categories varchar(255),
    primary key (recycler_id, accepted_categories)
);

create table participant_categories (
    participant_id varchar(255) not null,
    accepted_categories varchar(255),
    primary key (participant_id, accepted_categories)
);

create table application_categories (
    application_id varchar(255) not null,
    accepted_categories varchar(255),
    primary key (application_id, accepted_categories)
);

create index idx_pickup_collector_status on pickup_request (collector_id, status);
create unique index uq_custody_request_sequence on custody_event (request_id, sequence);

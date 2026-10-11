alter table pickup_request add column if not exists recycler_received_at timestamp;
alter table pickup_request add column if not exists recycling_status varchar(32);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.bookings (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        TEXT        NOT NULL,
  apellido      TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  telefono      TEXT        NOT NULL,
  booking_date  DATE        NOT NULL,
  slot_time     TIME        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'confirmed'
                            CHECK (status IN ('confirmed', 'cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_slot UNIQUE (booking_date, slot_time)
);

CREATE INDEX idx_bookings_date ON public.bookings (booking_date);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.bookings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

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

-- Publications
CREATE TABLE public.publications (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo       TEXT        NOT NULL,
  descripcion  TEXT        NOT NULL,
  autor        TEXT        NOT NULL,
  materiales   TEXT[]      NOT NULL DEFAULT '{}',
  estado       TEXT        NOT NULL DEFAULT 'disponible'
                           CHECK (estado IN ('disponible', 'agotado')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publications_estado ON public.publications (estado);
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.publications FOR SELECT TO anon USING (true);
CREATE POLICY "Service write" ON public.publications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Publication media
CREATE TABLE public.publication_media (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID        NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  url             TEXT        NOT NULL,
  type            TEXT        NOT NULL CHECK (type IN ('image', 'video')),
  display_order   INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pub_media_pub_id ON public.publication_media (publication_id);
ALTER TABLE public.publication_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.publication_media FOR SELECT TO anon USING (true);
CREATE POLICY "Service write media" ON public.publication_media FOR ALL TO service_role USING (true) WITH CHECK (true);

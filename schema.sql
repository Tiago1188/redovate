-- ===================================
-- ENUM DEFINITIONS
-- ===================================

DO $$ BEGIN
    CREATE TYPE plan_type_enum AS ENUM('free', 'starter', 'business');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE business_status_enum AS ENUM('active', 'pending', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE layout_type_enum AS ENUM('business', 'portfolio', 'ecommerce');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE template_status_enum AS ENUM('active', 'draft', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE target_audience_enum AS ENUM('sole_trader', 'company', 'any');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE business_type_enum AS ENUM('sole_trader', 'company');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE section_status_enum AS ENUM('missing', 'pending', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===================================
-- TABLE: users
-- ===================================

CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    plan_type plan_type_enum,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ===================================
-- TABLE: business_industries
-- ===================================

CREATE TABLE IF NOT EXISTS business_industries(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ===================================
-- TABLE: businesses
-- ===================================

CREATE TABLE IF NOT EXISTS businesses(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    industry_id UUID REFERENCES business_industries(id),

    business_name TEXT NOT NULL,
    trading_name TEXT,
    slug TEXT UNIQUE NOT NULL,
    abn TEXT,
    category TEXT,
    business_type business_type_enum DEFAULT 'sole_trader',
    year_founded INT,

    tagline TEXT,
    about TEXT,
    

    locations JSONB DEFAULT '[]',
    service_areas JSONB DEFAULT '[]',
    services JSONB DEFAULT '[]',
    keywords JSONB DEFAULT '[]',
    products JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    site_content JSONB DEFAULT '{}'::jsonb,
    services_raw JSONB DEFAULT '[]',

    logo TEXT,
    hero_image TEXT,
    favicon TEXT,
    theme JSONB DEFAULT '{}',
    hours JSONB DEFAULT '{}',

    email TEXT,
    phone TEXT,
    mobile TEXT,
    social_links JSONB DEFAULT '{}',

    website_url TEXT,
    base_content JSONB DEFAULT '{}'::jsonb,
    

    -- Domain + DNS verification
    domain TEXT,
    dns_verification_token TEXT,
    verified BOOLEAN DEFAULT false,
    verified_date TIMESTAMP,
    verified_method TEXT,

    -- Plan & Status
    terms_accepted BOOLEAN DEFAULT false,
    plan_type plan_type_enum DEFAULT 'free',
    plan_expiry_date DATE,
    status business_status_enum DEFAULT 'active',

    -- AI Usage Tracking
    ai_generations_count INT DEFAULT 0,
    ai_period_start TIMESTAMP DEFAULT now(),

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ===================================
-- TABLE: templates
-- ===================================

CREATE TABLE IF NOT EXISTS templates(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail TEXT,
    theme_default JSONB DEFAULT '{}',
    layout_type layout_type_enum DEFAULT 'business',
    supported_props JSONB DEFAULT '{}',
    plan_level plan_type_enum DEFAULT 'free',
    target_audience target_audience_enum DEFAULT 'any',
    components JSONB DEFAULT '[]',
    status template_status_enum DEFAULT 'active',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    fake_content JSONB DEFAULT '{}'::jsonb,
    html_template TEXT
);

-- ===================================
-- TABLE: business_templates
-- ===================================

CREATE TABLE IF NOT EXISTS business_templates(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ===================================
-- TABLE: template_sections
-- ===================================

CREATE TABLE IF NOT EXISTS template_sections(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    label TEXT,
    description TEXT,
    required BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ===================================
-- TABLE: business_section_status
-- ===================================

CREATE TABLE IF NOT EXISTS business_section_status(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES template_sections(id) ON DELETE CASCADE,
    status section_status_enum DEFAULT 'missing',
    completion_percent INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS template_section_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,           -- e.g. "HeroSection"
    
    field_name TEXT NOT NULL,             -- e.g. "headline"
    field_label TEXT,                     -- e.g. "Main Headline"
    field_type TEXT NOT NULL,             -- "string", "array", "image", "richtext", "number"
    
    required BOOLEAN DEFAULT false,
    helper_text TEXT,

    min_length INT,
    max_length INT,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS business_selected_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,

    section_name TEXT NOT NULL,          -- "hero/Hero3", "services/Services2"
    sort_order INT NOT NULL,             -- order on the page

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS business_section_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,               -- e.g., "hero/Hero3"
    
    field_name TEXT NOT NULL,                 -- "headline", "subheadline"
    field_value TEXT,                         -- everything stored as text or JSON string

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


-- ===================================
-- INDEXES
-- ===================================

CREATE INDEX IF NOT EXISTS idx_users_plan_type ON users(plan_type);

CREATE INDEX IF NOT EXISTS idx_businesses_plan_type ON businesses(plan_type);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_business_type ON businesses(business_type);
CREATE INDEX IF NOT EXISTS idx_businesses_industry_id ON businesses(industry_id);

CREATE INDEX IF NOT EXISTS idx_templates_plan_level ON templates(plan_level);
CREATE INDEX IF NOT EXISTS idx_templates_target_audience ON templates(target_audience);

CREATE INDEX IF NOT EXISTS idx_business_templates_business_id ON business_templates(business_id);
CREATE INDEX IF NOT EXISTS idx_business_templates_template_id ON business_templates(template_id);

CREATE INDEX IF NOT EXISTS idx_template_sections_template_id ON template_sections(template_id);

CREATE INDEX IF NOT EXISTS idx_business_section_status_business_id ON business_section_status(business_id);
CREATE INDEX IF NOT EXISTS idx_business_section_status_section_id ON business_section_status(section_id);

-- Fulltext search index
CREATE INDEX IF NOT EXISTS idx_businesses_fulltext_search ON businesses
USING GIN (
    to_tsvector(
        'english',
        business_name || ' ' ||
        coalesce(trading_name, '') || ' ' ||
        coalesce(category, '') || ' ' ||
        coalesce(tagline, '')
    )
);

-- ===================================
-- TRIGGERS
-- ===================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER business_industries_updated_at
BEFORE UPDATE ON business_industries
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER templates_updated_at
BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER business_templates_updated_at
BEFORE UPDATE ON business_templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER template_sections_updated_at
BEFORE UPDATE ON template_sections
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- business_section_status intentionally has no updated_at trigger

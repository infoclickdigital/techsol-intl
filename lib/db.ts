import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_U9CmPoRTBnL3@ep-sparkling-dust-aoh8g1za.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Initialize the SQL client. We use the connectionString directly.
const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;

// Define interfaces for tables
export interface Enquiry {
  id: string;
  type: 'product' | 'contact' | 'chat';
  client_name: string;
  client_phone: string;
  client_address: string;
  industry: string;
  inquiry_type_or_model: string;
  description: string;
  session_chat_history: string; // JSON string represent history
  created_at: Date;
  status?: string; // Pending, Working, Evaluating, Closed
}

export interface CmsConfig {
  key: string;
  value: string;
}

export interface DBProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  capacity: string;
  power: string;
  specs: string; // JSON string represent dynamic key-values
  image_url: string;
}

export interface DBService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  details: string;
  image_url: string;
}

export interface DBBlog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
  image_url: string;
}

export interface DBTestimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  quote: string;
  image_url: string;
}

export interface DBB2BProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  application: string;
  image_url: string;
}

export interface DBTeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
}

// Function to initialize tables and seed them with initial content if empty
export async function initDb() {
  try {
    // 1. Create Enquiries Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_enquiries (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(100),
        client_address TEXT,
        industry VARCHAR(100),
        inquiry_type_or_model VARCHAR(255),
        description TEXT,
        session_chat_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Ensure status column exists (migration)
    try {
      await sql`
        ALTER TABLE techsol_enquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending'
      `;
    } catch (err) {
      console.warn('Enquiries status column alter warning:', err);
    }

    // 2. Create Config/Settings Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_config (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    // 3. Create CMS Dynamic Content Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_cms (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    // 4. Create Products Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_products (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        capacity VARCHAR(255),
        power VARCHAR(255),
        specs TEXT,
        image_url TEXT
      )
    `;

    // 5. Create Services Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_services (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL,
        details TEXT,
        image_url TEXT
      )
    `;

    // 6. Create Blogs Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_blogs (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        author VARCHAR(255) NOT NULL,
        read_time VARCHAR(100) NOT NULL,
        image_url TEXT
      )
    `;

    // 7. Create Admins Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_admins (
        username VARCHAR(100) PRIMARY KEY,
        password VARCHAR(255) NOT NULL
      )
    `;

    // 8. Create Testimonials Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_testimonials (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        quote TEXT NOT NULL,
        image_url TEXT
      )
    `;

    // 9. Create B2B Products Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_b2b_products (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        application TEXT,
        image_url TEXT
      )
    `;

    // 10. Create Team Members Table
    await sql`
      CREATE TABLE IF NOT EXISTS techsol_team (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL
      )
    `;

    // --- Seeding Actions ---

    // Seed Config if empty
    const configs = await sql`SELECT * FROM techsol_config`;
    if (configs.length === 0) {
      await sql`
        INSERT INTO techsol_config (key, value) VALUES 
        ('spreadsheet_id', ''),
        ('recipient_emails', 'info@techsol.international'),
        ('cloudinary_cloud_name', 'techsol-international'),
        ('cloudinary_api_key', ''),
        ('cloudinary_api_secret', ''),
        ('social_facebook', 'https://facebook.com/techsol.international'),
        ('social_instagram', 'https://instagram.com/techsol.international'),
        ('social_linkedin', 'https://linkedin.com/company/techsol-international'),
        ('contact_address', 'Tinkune-32, Kathmandu, Nepal (Near Tinkune Bridge)'),
        ('contact_phone', '+977-1-4491100, +977-9851023450'),
        ('contact_email', 'info@techsol.international'),
        ('contact_industrial_centers', 'Tinkune (Kathmandu) & Mills Parkway (Biratnagar, Bhairahawa)')
      `;
    } else {
      // Ensure specific keys exist even if some are already there
      const keysToEnsure = [
        { k: 'social_facebook', v: 'https://facebook.com/techsol.international' },
        { k: 'social_instagram', v: 'https://instagram.com/techsol.international' },
        { k: 'social_linkedin', v: 'https://linkedin.com/company/techsol-international' },
        { k: 'contact_address', v: 'Tinkune-32, Kathmandu, Nepal (Near Tinkune Bridge)' },
        { k: 'contact_phone', v: '+977-1-4491100, +977-9851023455' },
        { k: 'contact_email', v: 'info@techsol.international' },
        { k: 'contact_industrial_centers', v: 'Tinkune (Kathmandu) & Mills Parkway (Biratnagar, Bhairahawa)' }
      ];
      for (const item of keysToEnsure) {
        await sql`
          INSERT INTO techsol_config (key, value)
          VALUES (${item.k}, ${item.v})
          ON CONFLICT (key) DO NOTHING
        `;
      }
    }

    // Seed Admins if empty
    const admins = await sql`SELECT * FROM techsol_admins`;
    if (admins.length === 0) {
      await sql`
        INSERT INTO techsol_admins (username, password) VALUES 
        ('TechsolIntl', 'techsol2026')
      `;
    }

    // Seed and synchronize CMS configuration values with new food/flavour branding
    const essentialCmsItems = [
      { key: 'home_hero_title', value: "Nepal's Trusted Partner for Food Flavours & Industry Solutions" },
      { key: 'home_hero_subtitle', value: "We supply premium food flavours, functional ingredients, and machine consulting services to food manufacturers across Nepal — helping you create products that people love, at every scale." },
      { key: 'home_hero_description', value: "Flavour Your World. Fuel Your Industry." },
      { key: 'home_spice_tech_badge', value: "Who We Are" },
      { key: 'home_spice_tech_title', value: "Your Complete Flavour & Food Solutions Partner in Nepal" },
      { key: 'home_spice_tech_description', value: "Techsol International was founded with a single purpose — to bridge the gap between world-class food ingredient technology and Nepal's growing food and beverage manufacturing industry.\n\nBased in Nepal, we are a dedicated supplier of premium food flavours, functional ingredients, and spice solutions. Beyond products, we also provide machine consulting services to help food manufacturers set up, optimize, and scale their production lines with confidence.\n\nWe believe great food starts with great ingredients. Whether you're a small artisan bakery or a large industrial food processor, Techsol International brings you the right flavours, the right expertise, and the right support — so you can focus on what matters most: making exceptional products." },
      { key: 'home_about_badge', value: "A Complete Range" },
      { key: 'home_about_title', value: "A Complete Range of Flavours & Ingredients for Every Application" },
      { key: 'home_about_description', value: "From sweet to savoury, dairy to bakery — our product portfolio covers the full spectrum of food flavouring and functional ingredient needs for Nepal's food manufacturers." },
      { key: 'home_about_image_url', value: 'https://images.unsplash.com/photo-1596540033229-a9821ebd058d?auto=format&fit=crop&q=80&w=650' },
      { key: 'about_hero_title', value: "Our Heritage & Vision" },
      { key: 'about_hero_subtitle', value: "Partnering with Nepal's food manufacturers to elevate taste, lock in premium quality, and consult on production excellence." },
      { key: 'about_story', value: "Techsol International was established with a singular vision: to support Nepal's food and agro-industrial sector with high-quality ingredients, premium food flavours, and expert machine consulting services. Since 2011, we have grown to become a dedicated supplier of premium food flavours, functional ingredients, namkeen spice seasonings, and bakery solutions. We partner closely with local manufacturers from our bases in Tinkune, Kathmandu, helping scale production lines and formulate delicious, consumer-loved products." },
      { key: 'about_mission', value: "To empower Nepal's food industry with premium flavour solutions and expert consultation, enabling manufacturers to deliver consistent, high-quality products that delight consumers." },
      { key: 'about_vision', value: "To be Nepal's most trusted and innovative food flavour and ingredient partner — setting the standard for quality, reliability, and industry support." },
      { key: 'home_industry_title_1', value: 'Bakery & Confectionery' },
      { key: 'home_industry_desc_1', value: 'Breads, cakes, biscuits, cookies, pastries, chocolates, and candies — we supply flavours and functional ingredients that deliver consistent taste and texture at scale.' },
      { key: 'home_industry_title_2', value: 'Beverages' },
      { key: 'home_industry_desc_2', value: 'Soft drinks, juices, energy drinks, flavoured water, traditional Nepali drinks — our liquid and powder flavours ensure clean, vibrant taste profiles.' },
      { key: 'home_industry_title_3', value: 'Dairy & Ice Cream' },
      { key: 'home_industry_desc_3', value: 'Flavoured milk, yoghurt, paneer, butter, ice cream, and kulfi — our dairy-specific flavour range is optimized for heat stability and cold temperature performance.' },
      { key: 'home_industry_title_4', value: 'Snacks & Namkeen' },
      { key: 'home_industry_desc_4', value: 'Chips, extruded snacks, nuts, popcorn, and puffed products — our savoury seasoning blends deliver the bold tastes Nepali consumers love.' },
      { key: 'about_operational_framework', value: 'Techsol International provides certified food-grade, safe, and highly calibrated flavor formulations and production layouts that comply with global hygiene and manufacturing standards.' },
      { key: 'about_cert_1_title', value: 'Government Grade 1' },
      { key: 'about_cert_1_desc', value: 'Certified for handling multi-TPH heavy milling erections.' },
      { key: 'about_cert_2_title', value: 'ISO 9001:2015 Standards' },
      { key: 'about_cert_2_desc', value: 'All CCD cameras and air manifolds compliant with global safety.' },
      { key: 'home_slider_image_1', value: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=1200' },
      { key: 'home_slider_image_2', value: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200' },
      { key: 'home_slider_image_3', value: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=1200' },
      { key: 'home_slider_image_4', value: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200' },
      { key: 'home_slider_image_5', value: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200' },
      { key: 'home_about_section_image', value: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800' },
      { key: 'home_about_section_heading', value: 'Your Premier Partner in Food Flavour & Production Science' },
      { key: 'home_about_section_text', value: 'Techsol International bridges the gap between premium global ingredient science and Nepal\'s burgeoning food manufacturing industry. Operating from Koteshwor-Tinkune in Kathmandu, we supply high-grade food flavours, compound seasonings, and specialized recipe formulations to major confectionery, beverage, dairy, and snack brands across Nepal.' },
      { key: 'home_about_section_subtext', value: 'Beyond world-class ingredients, we provide professional mechanical and plant engineering consulting. From automated optical sorting setups to turnkey flour mills and liquid packaging lines, we help local food processors optimize layouts, reduce overheads, and scale output cleanly.' },
      { key: 'trust_strip_text', value: 'Trusted by bakeries, beverage plants, confectionery units, dairy processors & more across Nepal' }
    ];

    const currentHero = await sql`SELECT value FROM techsol_cms WHERE key = 'home_hero_title' LIMIT 1`;
    const isOldPlaceholder = currentHero.length === 0 || 
      currentHero[0].value.includes('Advanced Grain Processing') || 
      currentHero[0].value.includes('Advanced grain processing');

    if (isOldPlaceholder) {
      // Perform a one-time migration to our beautiful new copywriting
      for (const item of essentialCmsItems) {
        await sql`
          INSERT INTO techsol_cms (key, value) 
          VALUES (${item.key}, ${item.value})
          ON CONFLICT (key) DO UPDATE SET value = ${item.value}
        `;
      }
    } else {
      // Ensure missing/new items are still seeded
      for (const item of essentialCmsItems) {
        await sql`
          INSERT INTO techsol_cms (key, value) 
          VALUES (${item.key}, ${item.value})
          ON CONFLICT (key) DO NOTHING
        `;
      }
    }

    // Seed/Update Testimonials
    const updatedTestimonials = [
      {
        id: 't_bakery',
        name: 'Production Manager',
        designation: 'Leading Bakery Company',
        company: 'Kathmandu',
        quote: 'Techsol has been our go-to flavour supplier for over 5 years. The consistency of their products and the technical support they provide is unmatched in Nepal.',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      },
      {
        id: 't_snack',
        name: 'Factory Owner',
        designation: 'Snack Food Manufacturer',
        company: 'Pokhara',
        quote: 'Their machine consulting team helped us redesign our production line and reduce waste by nearly 20%. Highly recommended.',
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
      },
      {
        id: 't_noodle',
        name: 'R&D Head',
        designation: 'Noodle Manufacturing Company',
        company: 'Nepal',
        quote: 'The custom spice blend they developed for our instant noodle range has become our bestselling product variant. Techsol truly understands our market.',
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
      }
    ];

    const currentTestimonials = await sql`SELECT * FROM techsol_testimonials`;
    const hasOldTestimonials = currentTestimonials.some(t => t.company?.includes('Biratnagar') || t.company?.includes('Terai'));
    if (currentTestimonials.length === 0 || hasOldTestimonials) {
      if (hasOldTestimonials) {
        await sql`DELETE FROM techsol_testimonials`;
      }
      for (const t of updatedTestimonials) {
        await sql`
          INSERT INTO techsol_testimonials (id, name, designation, company, quote, image_url)
          VALUES (${t.id}, ${t.name}, ${t.designation}, ${t.company}, ${t.quote}, ${t.image_url})
        `;
      }
    }

    // Seed Products if empty
    const products = await sql`SELECT * FROM techsol_products`;
    if (products.length === 0) {
      await sql`
        INSERT INTO techsol_products (id, category, name, description, capacity, power, specs, image_url) VALUES 
        ('rice-mill-1', 'milling', 'Techsol Elite Rice Miller 1500', 'High-yield multi-stage horizontal whitener and polisher. Drastically minimizes grain breakage while preserving the husk integrity.', '15.0 - 20.0 Metric Tons / Hr', '45 kW High-torque Phase 3 Motors', '{"Separation Grade": "Grade 1 Certified", "Roll Speed": "850 RPM calibrated", "Aspirator Capacity": "65 m³/min High-volume"}', 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600'),
        ('flour-milling-1', 'milling', 'Precision Wheat Flour Milling Roller Mill', 'State-of-the-art dual and quadruple rolling mill assemblies. Ideal for manufacturing high-quality Maida, Sooji, and Atta flour.', '10.0 - 12.0 Tons / Hr', '37 kW High-efficiency Phase 3 Units', '{"Feed Controller": "Variable Speed Magnetic Feedback", "Roll Dimensions": "Ø 250mm x 1000mm length", "Adjustment Method": "Pneumatic Roller Clamping"}', 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'),
        ('optical-sorter-1', 'sorting', 'AeroSort Multi-Chroma Optical CCD Sorter', 'High-resolution Japanese CCD 5400-pixel camera arrays tracking defective colors, specs, and contaminants down to 0.01mm structures.', '4.5 - 6.0 Tons / Hr input grain', '2.5 kW Ultra efficient + Air Supply', '{"Camera Resolution": "5400px Multi-chromatic CCD", "Ejector Lifetime": "15 Billion cycles response logic", "Chute Layout": "64 channels high-slick modular"}', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'),
        ('liquid-packer-1', 'packing', 'SpeedPack Linear Liquid Processing & Filler', 'Automatic volumetric liquid filling technology, perfectly calibrated for juices, mineral water, dairy, and edible oils.', '4000 - 6000 Bottles / Hr', '7.5 kW Intelligent Servo Drive', '{"Nozzles": "8-Head Rotary System", "Filling Precision": "±0.5% calibrated", "Container Range": "200ml to 2000ml PET"}', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600'),
        ('factory-auto-1', 'automation', 'Industrial PLC Plant Control Console', 'Central monitoring control console configured with high-slick SCADA boards. Integrates seamlessly with all milling and packaging assemblies.', 'Unified Control (Max 24 lines)', '0.8 kW Panel + Telemetry sensors', '{"Controller Core": "Siemens S7-1500 Modular Line", "HMI Panel": "15-inch Tempered Touch Vector Panel", "Data Integration": "Modbus, Profinet, and OPC UA supported"}', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600')
      `;
    }

    // Seed Services if empty
    const services = await sql`SELECT * FROM techsol_services`;
    if (services.length === 0) {
      await sql`
        INSERT INTO techsol_services (id, title, description, icon_name, details, image_url) VALUES 
        ('service-sorting', 'Smart Optical Sorting Calibration', 'Our team provides high-chromatic CCD optical sorting installation and precision calibration, ensuring 99.98% purity.', 'Cpu', 'We customize the ejection sensitivity settings on-site to handle dynamic grain properties, such as locally farmed rice, pulses, and organic green tea leaves.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'),
        ('service-turnkey', 'Complete Turnkey Project Management', 'End-to-end industrial architecture, mechanical erection, civil foundation verification, and logical automation.', 'Factory', 'From blueprinted plant flow diagrams to full production commissioning, we take complete structural accountability for modern factories across Nepal.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'),
        ('service-liquid', 'Liquid Processing & Filling Systems', 'High-speed linear and rotary volumetric liquid processing and packaging solutions.', 'Zap', 'Designed with food-grade SUS316 clean components. Suitable for bottled Himalayan spring water, local edible oils, fruit beverage nectars, and packaging.', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600'),
        ('service-milling', 'Grain Processing Plant Engineering', 'Designing and scaling industrial-grade high-yield flour mills and rice mills.', 'Settings', 'We supply high-rigidity roller assemblies and vibro-destoners, along with pneumatic conveying routes that maximize hourly output and reduce ash content.', 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600'),
        ('service-customer', '24/7 Operations & Maintenance', 'Local engineering support dispatched from our Kathmandu and Biratnagar offices.', 'ShieldCheck', 'With localized stocks of critical spare parts (e.g. CCD cameras, high-slick modular chutes, pneumatic ejectors, PLC controllers), we guarantee zero plant downtime.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600')
      `;
    }

    // Seed Blogs if empty
    const blogs = await sql`SELECT * FROM techsol_blogs`;
    if (blogs.length === 0) {
      await sql`
        INSERT INTO techsol_blogs (id, title, excerpt, content, category, date, author, read_time, image_url) VALUES 
        ('optical-sorting-nepal', 'The Economics of Smart Optical Sorting in Nepal’s Agribusinesses', 'Manual seed sorting and secondary winnowing represent hefty labor bills across agricultural processing sectors. This research provides a thorough analysis of color sorter ROI and contaminant safety limits in local rice, lentil, and bean mills.', 'Food processing in Nepal is transitioning at an incredible pace. Traditional manual sorting of grains like rice, lentils, and black beans often suffers from high rates of error and severe biological containment issues. By implementing modern high-speed photoelectric optical CCD sorting arrays, Nepalese millers can achieve 99.98% purity. This post explains the capital expenditure of setting up an AeroSort system in industrial hotspots like Bhairahawa and Nepalgunj, demonstrating a rapid 14-month full payback period driven by labor optimization and market-premium quality grading.', 'Milling Technology', 'June 01, 2026', 'Er. R. K. Shrestha (Senior Plant Engineer)', '6 min read', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'),
        ('decentralized-wheat-milling', 'Decentralized Wheat Flour Milling: Scalability for Rural Municipalities', 'Establishing smaller 2 TPH wheat flour plants in central agricultural clusters reduces secondary freight charges across hill terrains. This guide reviews roller config models designed to grind high-quality Atta and Maida flour in co-op mills.', 'Transportation costs across Nepal’s challenging hilly topography represents up to 35% of the overall retail price of refined flour. Establishing smaller, localized milling clusters close to harvesting regions can revolutionize rural food security. This engineering paper outlines the layout of decentralized 2 TPH to 5 TPH wheat milling plants, showing how compact pneumatic roller assemblies can grind high-quality local wheat into fine Chakki Atta, Maida, and Sooji without requiring massive infrastructure footprints.', 'Factory Layouts', 'May 14, 2026', 'Abhushit Chaudhary (Project Lead)', '5 min read', 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=600'),
        ('industrial-plc-logics', 'Implementing PLC Logic Boards in Food Processing Lines', 'A technical analysis detailing system integrations using SCADA systems. We review sensor networks, electric safety clamping loops, and remote panel control calibrations required to avoid high voltage power surges across Terai industrial estates.', 'Industrial power swings are an everyday operational reality for factories located in Nepalese industrial estates. This article explores proper electrical grounding and Siemens PLC integration schemas designed to safeguard modern mills. By monitoring input currents, automated cutoff contactors, and telemetry sensors via a central SCADA interface, factory supervisors can enjoy continuous operating loads and prevent catastrophic damage to expensive mechanical components.', 'Automation Logic', 'April 20, 2026', 'Dr. S. K. Upadhyaya (Automation Advisor)', '8 min read', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600')
      `;
    }

    // Seed B2B Products if empty
    const b2b_products = await sql`SELECT * FROM techsol_b2b_products`;
    if (b2b_products.length === 0) {
      await sql`
        INSERT INTO techsol_b2b_products (id, category, name, description, application, image_url) VALUES 
        ('spices-1', 'spices', 'Compounded Seasoning Spices Mix', 'Custom-formulated savory seasoning powders. Perfect for instant noodles, potato chips, kurkure, and processed snack food coatings.', 'Recommended usage: 5% - 8% by weight on fried snacks.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'),
        ('chocolate-1', 'confectionery', 'Double Dark Chocolate Flavouring', 'Baking-stable dark chocolate flavor compounding. Formulated with carrier compounds that withstand intense tunnel oven temperatures.', 'Recommended dosage: 0.10% to 0.15% in biscuit dough mixes.', 'https://images.unsplash.com/photo-1548907040-4d42b521251c?auto=format&fit=crop&q=80&w=600'),
        ('butter-1', 'bakery', 'Premium Creamy Butter Flavouring', 'Excellent creamy sweet-dairy profiling that gives an authentic baked butter aroma to cookies, shortbreads, and cookies.', 'Recommended usage: 0.08% - 0.12% in flour fat-batter.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600'),
        ('strawberry-1', 'confectionery', 'Strawberry Candy Flavour Essence', 'High-intensity, sweet and fruity strawberry compound. Perfectly water-soluble and stable under high-heat confectionery boiling.', 'Recommended usage: 0.10% in hard-boiled sugars & jellies.', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=600'),
        ('whiskey-1', 'beverages', 'Oak-Matured Whiskey Flavour Compounding', 'Smoky peat and sweet wood-cask aroma essence for blending in local liquor assemblies & beverage production industries.', 'Recommended dosage: 0.05% - 0.10% in final whiskey blends.', 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=600')
      `;
    }

    // Seed Team Members if empty
    const team_members = await sql`SELECT * FROM techsol_team`;
    if (team_members.length === 0) {
      await sql`
        INSERT INTO techsol_team (id, name, position, image_url) VALUES 
        ('m1', 'Er. R. K. Shrestha', 'Senior Plant Designer & Co-founder', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
        ('m2', 'Abhushit Chaudhary', 'Corporate Project Director', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200')
      `;
    }

    console.log('Neon Database Tables initialized and seeded successfully.');
  } catch (err) {
    console.error('Core Database Table Initialization / Seed error:', err);
  }
}

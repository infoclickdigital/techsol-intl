import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

// Module-scoped in-memory cache to prevent pounding the database on every page load
let cachedData: any = null;
let lastFetchedAt = 0;
const CACHE_TTL = 86400000; // 24 hours (cache is invalidated reactively in real-time on any database write/mutation)

function invalidateCache() {
  cachedData = null;
  lastFetchedAt = 0;
}

export async function GET(req: NextRequest) {
  try {
    // Lazy init database tables or ensure they exist
    await initDb();

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'all';

    const now = Date.now();
    const isCacheValid = cachedData && (now - lastFetchedAt < CACHE_TTL);

    if (!isCacheValid) {
      // Fetch everything in a single, high-performance batch trip!
      const [cms, products, b2b_products, team, services, blogs, config, enquiries, testimonials] = await Promise.all([
        sql`SELECT * FROM techsol_cms`,
        sql`SELECT * FROM techsol_products ORDER BY id`,
        sql`SELECT * FROM techsol_b2b_products ORDER BY id`,
        sql`SELECT * FROM techsol_team ORDER BY id`,
        sql`SELECT * FROM techsol_services ORDER BY id`,
        sql`SELECT * FROM techsol_blogs ORDER BY id DESC`,
        sql`SELECT * FROM techsol_config`,
        sql`SELECT * FROM techsol_enquiries ORDER BY created_at DESC`,
        sql`SELECT * FROM techsol_testimonials ORDER BY id`,
      ]);

      cachedData = {
        cms,
        products,
        b2b_products,
        team,
        services,
        blogs,
        config,
        enquiries,
        testimonials,
      };
      lastFetchedAt = now;
    }

    if (scope === 'cms') {
      return NextResponse.json({ success: true, data: cachedData.cms });
    }

    if (scope === 'products') {
      return NextResponse.json({ success: true, data: cachedData.products });
    }

    if (scope === 'services') {
      return NextResponse.json({ success: true, data: cachedData.services });
    }

    if (scope === 'blogs') {
      return NextResponse.json({ success: true, data: cachedData.blogs });
    }

    if (scope === 'testimonials') {
      return NextResponse.json({ success: true, data: cachedData.testimonials });
    }

    if (scope === 'config') {
      return NextResponse.json({ success: true, data: cachedData.config });
    }

    if (scope === 'b2b_products') {
      return NextResponse.json({ success: true, data: cachedData.b2b_products });
    }

    if (scope === 'team') {
      return NextResponse.json({ success: true, data: cachedData.team });
    }

    if (scope === 'enquiries') {
      return NextResponse.json({ success: true, data: cachedData.enquiries });
    }

    return NextResponse.json({
      success: true,
      ...cachedData
    });
  } catch (error: any) {
    console.error('API GET Content error:', error);
    return NextResponse.json(
      { success: false, error: 'Database transaction failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { action, payload, token } = body;

    // Verify token directly against Neon database admin accounts
    let authorized = false;
    if (token) {
      const dbAdmins = await sql`SELECT * FROM techsol_admins WHERE password = ${token}`;
      if (dbAdmins.length > 0) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized credentials.' }, { status: 401 });
    }

    // Invalidate the cache for any data mutations
    invalidateCache();

    if (action === 'save_cms') {
      const { items } = payload; // Array of { key, value }
      for (const item of items) {
        await sql`
          INSERT INTO techsol_cms (key, value)
          VALUES (${item.key}, ${item.value})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `;
      }
      return NextResponse.json({ success: true, message: 'CMS updated successfully' });
    }

    if (action === 'save_config') {
      const { items } = payload; // Array of { key, value }
      for (const item of items) {
        await sql`
          INSERT INTO techsol_config (key, value)
          VALUES (${item.key}, ${item.value})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `;
      }
      return NextResponse.json({ success: true, message: 'System configs updated successfully' });
    }

    // --- Products Operations ---
    if (action === 'upsert_product') {
      const { id, category, name, description, capacity, power, specs, image_url } = payload;
      await sql`
        INSERT INTO techsol_products (id, category, name, description, capacity, power, specs, image_url)
        VALUES (${id}, ${category}, ${name}, ${description}, ${capacity}, ${power}, ${JSON.stringify(specs)}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          capacity = EXCLUDED.capacity,
          power = EXCLUDED.power,
          specs = EXCLUDED.specs,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'Product upserted successfully' });
    }

    if (action === 'delete_product') {
      const { id } = payload;
      await sql`DELETE FROM techsol_products WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Product deleted' });
    }

    // --- Services Operations ---
    if (action === 'upsert_service') {
      const { id, title, description, icon_name, details, image_url } = payload;
      await sql`
        INSERT INTO techsol_services (id, title, description, icon_name, details, image_url)
        VALUES (${id}, ${title}, ${description}, ${icon_name || 'Settings'}, ${details}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          icon_name = EXCLUDED.icon_name,
          details = EXCLUDED.details,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'Service upserted' });
    }

    if (action === 'delete_service') {
      const { id } = payload;
      await sql`DELETE FROM techsol_services WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Service deleted' });
    }

    // --- Blogs Operations ---
    if (action === 'upsert_blog') {
      const { id, title, excerpt, content, category, date, author, read_time, image_url } = payload;
      await sql`
        INSERT INTO techsol_blogs (id, title, excerpt, content, category, date, author, read_time, image_url)
        VALUES (${id}, ${title}, ${excerpt}, ${content}, ${category}, ${date}, ${author}, ${read_time}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          author = EXCLUDED.author,
          read_time = EXCLUDED.read_time,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'Blog upserted' });
    }

    if (action === 'delete_blog') {
      const { id } = payload;
      await sql`DELETE FROM techsol_blogs WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Blog deleted' });
    }

    // --- Testimonials Operations ---
    if (action === 'upsert_testimonial') {
      const { id, name, designation, company, quote, image_url } = payload;
      await sql`
        INSERT INTO techsol_testimonials (id, name, designation, company, quote, image_url)
        VALUES (${id}, ${name}, ${designation}, ${company}, ${quote}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name,
          designation = EXCLUDED.designation,
          company = EXCLUDED.company,
          quote = EXCLUDED.quote,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'Testimonial upserted' });
    }

    if (action === 'delete_testimonial') {
      const { id } = payload;
      await sql`DELETE FROM techsol_testimonials WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Testimonial deleted' });
    }

    // --- B2B Products (Spices & Flavours) Operations ---
    if (action === 'upsert_b2b_product') {
      const { id, category, name, description, application, image_url } = payload;
      await sql`
        INSERT INTO techsol_b2b_products (id, category, name, description, application, image_url)
        VALUES (${id}, ${category}, ${name}, ${description}, ${application}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          application = EXCLUDED.application,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'B2B Product upserted successfully' });
    }

    if (action === 'delete_b2b_product') {
      const { id } = payload;
      await sql`DELETE FROM techsol_b2b_products WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'B2B Product deleted successfully' });
    }

    // --- Team Operations ---
    if (action === 'upsert_team_member') {
      const { id, name, position, image_url } = payload;
      await sql`
        INSERT INTO techsol_team (id, name, position, image_url)
        VALUES (${id}, ${name}, ${position}, ${image_url})
        ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name,
          position = EXCLUDED.position,
          image_url = EXCLUDED.image_url
      `;
      return NextResponse.json({ success: true, message: 'Team member upserted successfully' });
    }

    if (action === 'delete_team_member') {
      const { id } = payload;
      await sql`DELETE FROM techsol_team WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
    }

    // --- Enquiries/Logs status update operations ---
    if (action === 'update_enquiry_status') {
      const { id, status } = payload;
      await sql`UPDATE techsol_enquiries SET status = ${status} WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'Enquiry status updated successfully' });
    }

    // --- Enquiries/Logs clear operations ---
    if (action === 'clear_enquiries') {
      const { type } = payload;
      if (type) {
        await sql`DELETE FROM techsol_enquiries WHERE type = ${type}`;
      } else {
        await sql`DELETE FROM techsol_enquiries`;
      }
      return NextResponse.json({ success: true, message: 'Enquiries cleared' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('API POST Content error:', error);
    return NextResponse.json(
      { success: false, error: 'Transaction failed: ' + error.message },
      { status: 500 }
    );
  }
}

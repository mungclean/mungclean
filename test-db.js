const { Client } = require('pg');

async function testConnection() {
  const regions = ['ap-northeast-2', 'us-east-1', 'us-west-1'];
  for (const region of regions) {
    const url = `postgresql://postgres.fkcbmrsyqcjvwqnjwdle:mungclean1234!@aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`;
    console.log(`Testing: ${url}`);
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      console.log(`Success with: ${region}`);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed for ${region}:`, err.message);
    }
  }
}

testConnection();

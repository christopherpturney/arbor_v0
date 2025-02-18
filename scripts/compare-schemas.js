const { createClient } = require('@supabase/supabase-js');

// Development database
const devClient = createClient(
  'https://gnxmyjhxyhyjckymaphq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueG15amh4eWh5amNreW1hcGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NjE0NDIsImV4cCI6MjA1NTMzNzQ0Mn0.1LkF-io8ysppcHU2_9COMslIwMxzzhhBU9RNaAzfnR4'
);

// Production database
const prodClient = createClient(
  'https://loyxjwbvdluclokdqacn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueG15amh4eWh5amNreW1hcGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NjE0NDIsImV4cCI6MjA1NTMzNzQ0Mn0.1LkF-io8ysppcHU2_9COMslIwMxzzhhBU9RNaAzfnR4'
);

async function checkFunctionsSQL(client, env) {
  try {
    const { data, error } = await client.rpc('get_functions');
    
    console.log(`\n${env} Functions:`);
    if (error) {
      console.log(`Error: ${error.message}`);
      console.log(`Code: ${error.code}`);
      console.log(`Details: ${error.details}`);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No functions found');
      return;
    }

    console.log('Functions found:', data);
  } catch (error) {
    console.log(`Error accessing functions: ${error.message}`);
  }
}

async function checkTriggersSQL(client, env) {
  try {
    const { data, error } = await client.rpc('get_triggers');
    
    console.log(`\n${env} Triggers:`);
    if (error) {
      console.log(`Error: ${error.message}`);
      console.log(`Code: ${error.code}`);
      console.log(`Details: ${error.details}`);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No triggers found');
      return;
    }

    console.log('Triggers:', data);
  } catch (error) {
    console.log(`Error accessing triggers: ${error.message}`);
  }
}

async function checkTable(client, tableName, env) {
  try {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .limit(1);

    console.log(`\n${env} ${tableName} check:`);
    if (error) {
      console.log(`Error: ${error.message}`);
      console.log(`Code: ${error.code}`);
      console.log(`Details: ${error.details}`);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('Table exists but no data found');
      
      // Get table structure
      const { data: structure, error: structError } = await client
        .from(tableName)
        .select()
        .limit(0);
        
      if (!structError) {
        console.log('Table columns:', Object.keys(structure));
      }
      return null;
    }

    console.log('Structure:', Object.keys(data[0]));
    return data[0];
  } catch (error) {
    console.log(`Error accessing table: ${error.message}`);
    return null;
  }
}

async function compareSchemas() {
  try {
    // Check functions and triggers in both environments
    console.log('\n--- Checking Functions and Triggers ---');
    await checkFunctionsSQL(devClient, 'Development');
    await checkFunctionsSQL(prodClient, 'Production');
    
    await checkTriggersSQL(devClient, 'Development');
    await checkTriggersSQL(prodClient, 'Production');

    // Check tables in both environments
    console.log('\n--- Checking Tables ---');
    await checkTable(devClient, 'users', 'Development');

    await checkTable(prodClient, 'users', 'Production');

  } catch (error) {
    console.error('Error:', error);
  }
}

compareSchemas(); 
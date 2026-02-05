import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

async function run() {
  const ids: string[] = await client.fetch(`*[_type in ["post","page"]]._id`)
  console.log(`Found ${ids.length} docs to delete`)

  for (const id of ids) {
    await client.delete(id)
  }

  console.log('Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

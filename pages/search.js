import { Card, Image, Text, Badge, Button, Group, Grid, Anchor, Input} from '@mantine/core';
import { useState} from 'react';
import searchresult from "../search.json"


export default function SearchPage() {
  const [search, setSearch] = useState('')
  const getStaticProps = async () => {
    await fetch('./api/scrap', {
      method: "POST",
      body: JSON.stringify({ search}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
   
  return (
    <>
      <div>
      <div>
          <Input id='search' value={search} type='text' placeholder='search' onChange={(e) => setSearch(e.target.value)} />
          <Button id='submit'  type='submit' onClick={getStaticProps}>search</Button>
        </div>
      </div>
      <div>
        <div style={{ marginTop: "20vh", marginLeft: '10vw', marginRight: '10vw' }}>
          <Grid gutter="xs">{
            searchresult.map(search => {
              return (
                <Grid.Col key={search.key}>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Card.Section component="a" href={search.link}>
                      <Group position="center" mt="md" mb="xs">
                        <Image
                          src={search.image}
                          height="250px"
                          width="fit-content"
                          alt="Product"
                        /></Group>
                    </Card.Section>
                    <Group position="center" mt="md" mb="xs">
                      <Text>{search.title}</Text>
                      <Badge color="pink" variant="light">
                        {search.site}
                      </Badge>
                    </Group>
                    <Anchor href={search.link} target="_blank">
                      <Group position="center" mt="md" mb="xs">
                        <Button variant="light" color="blue" mt="md" radius="md">
                        Rs. {search.mrp}
                        </Button></Group></Anchor>
                  </Card>
                </Grid.Col>
              )
            })
          }
          </Grid>
        </div>
      </div>
    </>
  )
}

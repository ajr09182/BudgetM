import { Card, Image, Text, Badge, Button, Group, Grid, Anchor } from '@mantine/core';
import { useState} from 'react';
import styles from '../styles/Home.module.css'
import searchresult from "../search.json"


export default function searchPage() {
  const [search, setSearch] = useState('');
  const getStaticProps = async () => {
    await fetch('./api/scrap', {
      method: "POST",
      body: JSON.stringify({ search}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  function Search(search){
    setSearch(search)
   }
  return (
    <>
      <div className={styles.searchwrap}>
      <div className={styles.search}>
          <input id='search' value={search} type='text' placeholder='search' className={styles.searchbar} onChange={(e) => Search(e.target.value)} />
          <button id='submit' className={styles.searchbutton} type='submit' onClick={getStaticProps}>search</button>
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

import styles from "../styles/Home.module.css"
import { Input } from '@mantine/core';


export default function Home() {
    return(
        <>
            <p className={styles.title}>BudgetM</p>
            <div className={styles.hero}></div>
            <div className={styles.search}>
            <Input radius="xl" size="md"/></div>
            <div className={styles.searchButton}>SEARCH</div>
            <div className={styles.card1}></div>
            <div className={styles.card2}></div>
            <p className={styles.subtitle}>Bored with these all E-commerce websites, yo bro believe me i am totally different  </p>
            <p className={styles.nomore}>NO MORE</p>
        </>
    )
}
import { CropItem } from './CropItem/CropItem'
 import search from '@/assets/images/search.png'
import filter from "@/assets/images/filter.png"
import guide from "@/assets/images/guide.png"
import styles from "./CropsList.module.css"

export function CropsList({handleCropChoice, setCropContext }) { 
  return (
    <div className={styles.wrapper}>
      
      <div className={styles.cropsList}>
        <nav className={styles.cropsListNav}>
          <p className={styles.cropsListTitle}>Recommended Crops</p>
          <div className={styles.toolbar}>
            <button className={styles.toolbarBtn}>
              <img src={search} alt="search" />
            </button>
            <button className={styles.toolbarBtn}>
              <img src={filter} alt="filter" />
            </button>
            <button className={styles.toolbarBtn}>
              <img src={guide} alt="guide" />
            </button>
          </div>
      </nav>
        <div className={styles.listBck}></div>
        
        <CropItem name="Beetroot" cropMonths="Oct-June" durationDays="80" rating="94"  handleCropChoice={handleCropChoice} setCropContext={setCropContext}/> 
         <CropItem name="Beetroot" cropMonths="Oct-June" durationDays="80" rating="94"  handleCropChoice={handleCropChoice} setCropContext={setCropContext}/> 
         <CropItem name="Beetroot" cropMonths="Oct-June" durationDays="80" rating="94"  handleCropChoice={handleCropChoice} setCropContext={setCropContext}/> 
         <CropItem name="Beetroot" cropMonths="Oct-June" durationDays="80" rating="94"  handleCropChoice={handleCropChoice} setCropContext={setCropContext}/> 
         <CropItem name="Beetroot" cropMonths="Oct-June" durationDays="80" rating="94"  handleCropChoice={handleCropChoice} setCropContext={setCropContext}/> 
      
      </div>
    </div>
  )
}
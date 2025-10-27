#  Horse Racing Game (Angular)

An interactive and visually engaging **Horse Racing Simulation Game** built with **Angular 19**, powered by **Signals** for reactivity and **Jest** for testing.  

---

##  Overview

The implementation focuses on:
- **Standalone components** for modularity and reusability  
- **Reactive state management** using Angular **Signals**  
- Clear separation between **UI**, **logic**, and **simulation services**  
- **Jest unit tests** 

---

## Game Features

###  Horse Generation
- Instantly generate between **1 and 20 horses**.  
- Each horse has:
  - A **unique color** for easy visual tracking  
  - A **condition score (1–100)** that affects its racing performance  

###  Race Schedule
- Clicking **Generate** automatically creates a **6-round race schedule**.  
- Each round randomly selects **10 horses** from the available pool, ensuring different combinations each time.
- You can click **Pause**/**Resume**/**Reset**/**Generate**/**Start** buttons

### Round Specifications
The rounds occur at different lengths in the following sequence::

| Round | Distance (m) |
|:------:|:-------------|
| 1 | 1200 |
| 2 | 1400 |
| 3 | 1600 |
| 4 | 1800 |
| 5 | 2000 |
| 6 | 2200 |


###  Results & Progress
- As each race concludes, results appear automatically in the **Results Panel**.  
- Results update **round by round**, reflecting the order in which races finish.  
- The **Track** and **Lane** components visualize live movement for each horse during every race.  

---


## Setup & Run

```bash
npm install
npm start
npm test

#!/usr/bin/env python
"""insert.py - Populate Django SQLite3 database with climate, crop, and suitability data."""

import os
import sys
import csv
from io import StringIO

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_myProject.settings')  # Change 'your_project' to your actual project name
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from crop.models import Climate, Crop, CropClimate, CropSoilTexture  # Change 'your_app' to your actual app name

# ------------------------------------------------------------
# Configuration
CLEAR_FIRST = True   # Set to False if you want to keep existing data
# ------------------------------------------------------------

# ========== 1. Climate data (climate.csv) ==========
CLIMATE_CSV = """id,climate_zone,mineralization_factor
1,Csa,0.03
2,BSh,0.025
3,BSk,0.02
4,BWh,0.01
"""

# ========== 2. Crop data (crop.csv) ==========
CROP_CSV = """id,crop_name,ph_min,ph_max,duration_Days,temp_min,temp_max,water_min_mm,water_max_mm,humidity_min,humidity_max,n_kg_ha,p_kg_ha,k_kg_ha,sampling_depth_cm,sampling_shape,sowing_month_start,sowing_month_end,note,root_depth_max_cm,root_depth_min_cm
1,Rice,5.5,7.0,120,20.0,40.0,1200.0,2500.0,70.0,90.0,80.0,50.0,50.0,30.0,Zigzag,4,5,Racines fasciculées standard.,50.0,30.0
2,Wheat,6.0,7.5,140,10.0,30.0,450.0,650.0,50.0,70.0,100.0,50.0,50.0,30.0,Zigzag,10,11,Racines fasciculées profondes.,150.0,100.0
3,Maize,5.5,7.0,100,15.0,35.0,500.0,800.0,50.0,80.0,120.0,60.0,60.0,30.0,Zigzag,3,4,Racines fasciculées massives.,200.0,150.0
4,Moringa,6.0,8.0,180,15.0,45.0,300.0,600.0,30.0,50.0,50.0,30.0,30.0,60.0,Circle,3,4,Racine pivotante d'arbre.,300.0,300.0
5,Ash gourd,6.0,7.5,120,20.0,35.0,400.0,600.0,60.0,80.0,40.0,30.0,30.0,30.0,Zigzag,3,4,Racines étalées.,120.0,90.0
6,Beetroot,6.0,7.5,90,10.0,30.0,400.0,500.0,60.0,80.0,80.0,40.0,60.0,30.0,Zigzag,9,10,Racine pivotante tubérisée.,90.0,60.0
7,Bengalgram,6.0,8.0,110,15.0,30.0,250.0,400.0,30.0,50.0,20.0,40.0,20.0,30.0,Zigzag,11,12,Racine pivotante.,120.0,90.0
8,Bhendi,6.0,7.5,90,20.0,35.0,400.0,600.0,60.0,80.0,80.0,40.0,40.0,30.0,Zigzag,4,5,Racine pivotante.,120.0,90.0
9,Bitter gourd,6.0,7.5,120,20.0,35.0,500.0,700.0,60.0,80.0,60.0,40.0,40.0,30.0,Zigzag,3,4,Racines latérales.,90.0,60.0
10,Blackgram,5.5,7.5,90,20.0,35.0,300.0,500.0,50.0,70.0,20.0,40.0,20.0,30.0,Zigzag,3,4,Racines modérément profondes.,90.0,60.0
11,Bottle gourd,6.0,7.5,120,20.0,35.0,400.0,600.0,60.0,80.0,60.0,30.0,30.0,30.0,Zigzag,3,4,Racines traçantes.,90.0,60.0
12,Brinjal,5.5,7.0,130,20.0,35.0,500.0,700.0,50.0,70.0,100.0,60.0,60.0,30.0,Zigzag,2,3,Racines fasciculées étendues.,150.0,100.0
13,Cabbage,6.0,7.5,120,10.0,25.0,400.0,600.0,60.0,80.0,120.0,60.0,60.0,15.0,Zigzag,9,10,Racines très superficielles.,90.0,60.0
14,Capsicum,5.5,7.0,120,15.0,30.0,500.0,700.0,60.0,80.0,100.0,50.0,50.0,30.0,Zigzag,2,3,Racines pivotantes latérales.,90.0,60.0
15,Carrot,6.0,7.0,100,12.0,28.0,350.0,500.0,60.0,80.0,60.0,40.0,80.0,30.0,Zigzag,9,10,Racine pivotante.,90.0,60.0
16,Castor,5.5,8.0,150,15.0,40.0,300.0,500.0,40.0,60.0,40.0,30.0,30.0,60.0,Circle,3,4,Racine pivotante d'arbuste.,300.0,150.0
17,Cauliflower,6.0,7.5,120,10.0,25.0,400.0,600.0,60.0,80.0,120.0,60.0,60.0,15.0,Zigzag,9,10,Racines très superficielles.,90.0,60.0
18,Chilie,5.5,7.0,140,18.0,32.0,500.0,700.0,50.0,70.0,80.0,40.0,40.0,30.0,Zigzag,2,3,Racine pivotante.,120.0,90.0
19,Chowchow,5.5,7.0,180,15.0,28.0,800.0,1200.0,70.0,90.0,80.0,40.0,40.0,30.0,Circle,3,3,Racines fasciculées.,90.0,60.0
20,Cluster bean,6.0,8.5,100,20.0,38.0,200.0,400.0,30.0,50.0,20.0,30.0,20.0,60.0,Zigzag,4,5,Racine pivotante très profonde.,200.0,150.0
21,Cotton,5.5,8.0,180,18.0,38.0,600.0,1000.0,40.0,60.0,80.0,40.0,40.0,60.0,Zigzag,3,4,Racine pivotante profonde.,300.0,150.0
22,Cowpea,5.5,7.5,90,20.0,35.0,300.0,500.0,40.0,60.0,20.0,30.0,20.0,30.0,Zigzag,4,5,Racines pivotantes robustes.,150.0,90.0
23,Cucumber,6.0,7.5,100,18.0,35.0,500.0,700.0,60.0,80.0,80.0,40.0,40.0,30.0,Zigzag,3,4,Racines fasciculées sensibles.,90.0,60.0
24,Elephant foot yam,5.5,7.0,300,25.0,35.0,1000.0,1500.0,70.0,90.0,100.0,50.0,100.0,30.0,Circle,3,4,Tubercule volumineux.,80.0,50.0
25,French bean,6.0,7.5,90,12.0,28.0,350.0,500.0,60.0,80.0,40.0,40.0,40.0,15.0,Zigzag,2,3,Racines peu profondes.,90.0,60.0
26,Sesame,5.5,8.0,100,20.0,38.0,300.0,500.0,40.0,60.0,40.0,30.0,20.0,30.0,Zigzag,4,5,Racine pivotante.,150.0,90.0
27,Mung beans,5.5,7.5,90,20.0,35.0,300.0,500.0,40.0,60.0,20.0,30.0,20.0,30.0,Zigzag,4,5,Racines modérément profondes.,120.0,90.0
28,Groundnut,5.5,7.5,130,22.0,33.0,500.0,700.0,50.0,70.0,20.0,40.0,30.0,15.0,Zigzag,3,4,Gousses très proches de la surface.,120.0,90.0
29,Horsegram,5.5,8.0,120,20.0,40.0,200.0,350.0,30.0,50.0,20.0,20.0,20.0,60.0,Zigzag,4,5,Racine pivotante très profonde.,200.0,150.0
30,Melon,6.0,7.5,120,20.0,35.0,400.0,600.0,50.0,70.0,60.0,40.0,40.0,30.0,Zigzag,3,4,Racine pivotante exploratrice.,180.0,120.0
31,Onion,6.0,7.0,150,12.0,28.0,400.0,600.0,60.0,80.0,80.0,40.0,80.0,15.0,Zigzag,11,12,Racines très courtes.,60.0,30.0
32,Proso millet,5.5,8.0,90,18.0,35.0,250.0,400.0,30.0,50.0,40.0,20.0,20.0,30.0,Zigzag,4,4,Racines fasciculées.,120.0,90.0
33,Pearl millet,5.5,8.5,100,22.0,40.0,250.0,400.0,30.0,50.0,50.0,30.0,30.0,60.0,Zigzag,4,5,Racine pivotante extrême.,300.0,200.0
34,Peas,6.0,7.5,120,10.0,25.0,300.0,450.0,60.0,80.0,40.0,40.0,40.0,30.0,Zigzag,10,11,Racines fasciculées.,120.0,90.0
35,Pumpkin,6.0,7.5,130,18.0,32.0,400.0,600.0,50.0,70.0,60.0,40.0,40.0,30.0,Zigzag,3,4,Racines étendues.,150.0,90.0
36,Radish,6.0,7.0,40,12.0,25.0,300.0,450.0,60.0,80.0,40.0,30.0,40.0,15.0,Zigzag,9,10,Racine courte superficielle.,60.0,30.0
37,Finger millet,5.5,7.0,120,20.0,35.0,300.0,450.0,40.0,60.0,40.0,20.0,20.0,30.0,Zigzag,4,4,Racines fasciculées denses.,120.0,90.0
38,Pigeon pea,5.5,8.0,180,20.0,38.0,300.0,500.0,30.0,50.0,20.0,40.0,20.0,60.0,Circle,3,4,Racine pivotante d'arbuste.,300.0,200.0
39,Ribbed gourd,6.0,7.5,120,20.0,35.0,400.0,600.0,60.0,80.0,60.0,30.0,30.0,30.0,Zigzag,3,4,Racines latérales.,90.0,60.0
40,Foxtail millet,5.5,8.0,90,18.0,35.0,250.0,400.0,30.0,50.0,40.0,20.0,20.0,30.0,Zigzag,4,4,Racines fasciculées.,120.0,90.0
41,Small onion,6.0,7.0,120,12.0,28.0,350.0,500.0,60.0,80.0,60.0,30.0,60.0,15.0,Zigzag,11,12,Racines très superficielles.,45.0,30.0
42,Snake gourd,6.0,7.5,120,20.0,35.0,500.0,700.0,60.0,80.0,60.0,30.0,30.0,30.0,Zigzag,3,4,Racines fasciculées.,90.0,60.0
43,Sorghum,5.5,8.0,120,18.0,38.0,400.0,600.0,30.0,50.0,80.0,40.0,40.0,60.0,Zigzag,3,4,Racines fasciculées très profondes.,250.0,150.0
44,Soyabean,6.0,7.5,120,18.0,33.0,500.0,700.0,60.0,80.0,20.0,60.0,20.0,30.0,Zigzag,3,4,Racine pivotante.,150.0,90.0
45,Sugarbeet,6.0,8.0,180,12.0,28.0,500.0,800.0,60.0,80.0,100.0,50.0,100.0,60.0,Zigzag,10,11,Racine pivotante profonde.,300.0,150.0
46,Sugarcane,6.0,8.0,360,20.0,38.0,1500.0,2500.0,60.0,80.0,150.0,80.0,80.0,60.0,Grille,2,3,Racines adventives profondes.,300.0,200.0
47,Sunflower,6.0,7.5,130,15.0,32.0,400.0,600.0,40.0,60.0,60.0,40.0,60.0,60.0,Zigzag,3,4,Racine pivotante massive.,300.0,200.0
48,Sweet potato,5.5,7.0,130,22.0,32.0,500.0,700.0,60.0,80.0,40.0,40.0,60.0,30.0,Zigzag,3,4,Racines tubérisées étalées.,90.0,60.0
49,Round gourd,6.0,7.5,100,22.0,38.0,300.0,500.0,40.0,60.0,40.0,30.0,20.0,30.0,Zigzag,4,4,Racine pivotante.,120.0,90.0
50,Tomato,5.5,7.0,140,18.0,32.0,500.0,700.0,60.0,80.0,100.0,60.0,60.0,30.0,Zigzag,2,3,Racine pivotante.,150.0,90.0
51,Kodo millet,5.5,8.0,100,20.0,38.0,250.0,400.0,30.0,50.0,30.0,20.0,20.0,30.0,Zigzag,4,4,Racines fasciculées.,120.0,90.0
52,Watermelon,5.5,7.5,120,22.0,35.0,400.0,600.0,50.0,70.0,60.0,40.0,40.0,30.0,Zigzag,3,4,Racine pivotante.,180.0,120.0
"""

# ========== 3. CropClimate data (cropclimate.csv) ==========
CROPCLIMATE_CSV = """id,rating,Note,climate_id,crop_id
2,3,Requires flooded fields; strictly limited to irrigated lowlands.,1,1
3,5,Perfect match for rainy winters; rain-fed cultivation is standard.,1,2
4,4,Suitable with supplemental irrigation; drought-tolerant varieties recommended.,2,2
5,5,Well adapted to cool steppe climate; reliable yields with hardy varieties.,3,2
7,4,Requires summer irrigation; heat matches growing season.,1,3
8,3,Requires drought-tolerant varieties; irrigation essential at flowering.,2,3
9,3,Short-season varieties required; sensitive to cold snaps.,3,3
11,4,Thrives in warmth; drought tolerant once established.,1,4
12,5,Native-like conditions; excellent for arid zones.,2,4
13,4,Tolerates poor soils; irrigation needed for optimal leaf production.,3,4
14,4,Highly drought resistant; suitable for oasis agriculture.,4,4
15,4,Adaptable; requires standard irrigation in summer.,1,5
16,4,Performs well in heat; retains moisture; requires regular watering.,2,5
17,3,Needs warm microclimate; sensitive to frost; irrigation essential.,3,5
18,3,Can survive high heat; strictly requires shaded roots and irrigation.,4,5
19,4,Best as a winter/spring crop; tolerant of mild frost.,1,6
20,3,Needs winter planting; requires consistent soil moisture.,2,6
21,4,Spring/Summer crop; cool nights enhance color and sweetness.,3,6
22,3,Grow only in winter months; protect from extreme afternoon heat.,4,6
24,5,Ideal winter rain-fed crop; fixes nitrogen in soil.,1,7
25,5,Highly drought resistant; excellent for dryland farming systems.,2,7
26,4,Suitable for rotation; hardy against cool steppe winds.,3,7
27,3,Limited to winter season with minimal irrigation.,4,7
29,4,Needs summer heat; sensitive to frost; easy to grow.,1,8
30,5,Loves intense heat; productive with moderate irrigation.,2,8
31,4,Grows well in warmth; select early maturing varieties.,3,8
32,4,Thrives in desert heat if watered regularly.,4,8
34,4,Needs trellis and summer heat; regular watering required.,1,9
35,4,High heat tolerance; requires consistent irrigation.,2,9
36,3,Needs warm start; sensitive to temperature drops.,3,9
37,3,Requires shade netting and frequent irrigation in peak summer.,4,9
38,4,Warm season pulse; improves soil fertility.,1,10
39,4,Drought tolerant; good for dryland rotation.,2,10
40,3,Requires irrigation; sensitive to frost.,3,10
41,3,Needs winter planting and irrigation; heat tolerant varieties.,4,10
43,4,Summer crop; needs support/trellis; high water need.,1,11
44,4,Adapts to heat; requires reliable irrigation.,2,11
45,3,Needs warm sheltered spots; irrigation essential.,3,11
46,3,Grows rapidly with water; handle extreme heat with shading.,4,11
48,4,Long growing season; heat loving.,1,12
49,4,Tolerates heat well; requires consistent soil moisture.,2,12
50,3,Needs warm microclimate; protect from cold winds.,3,12
51,3,Grows well with irrigation; watch for spider mites in dry heat.,4,12
53,5,Winter crop; thrives in cool moist coastal weather.,1,13
54,3,Requires winter planting; heat causes bolting.,2,13
55,4,Excellent for spring/summer harvest; heads firm well in cool nights.,3,13
57,4,Warm season crop; sensitive to extreme heat/cold fluctuation.,1,14
58,3,Requires shade netting in summer; irrigation critical.,2,14
59,3,Needs warmth; slow growth in cool spells.,3,14
61,4,Winter/Spring crop; deep sandy loam preferred.,1,15
62,3,Plant in autumn; irrigation needed for root swelling.,2,15
63,4,Cool nights enhance sugar content; sandy soils ideal.,3,15
64,3,Winter crop only; shape may be affected in coarse sand.,4,15
66,4,Hardy perennial; low maintenance; industrial use.,1,16
67,5,Drought resistant; thrives on marginal lands.,2,16
68,4,Adaptable to poor soils; hardy semi-arid crop.,3,16
69,4,Xerophytic nature suits desert; requires deep soil.,4,16
71,5,Winter crop; requires consistent moisture.,1,17
72,3,Needs cool season; stress causes small curds.,2,17
73,4,Good for summer cultivation; curds need protection from sun.,3,17
75,4,Needs warm dry weather for ripening; water moderate.,1,18
76,4,High heat increases pungency; drought tolerant.,2,18
77,3,Needs warm season; protect from cold.,3,18
78,3,Grows with irrigation; prone to sunscald on fruit.,4,18
80,3,Requires trellis; sensitive to water stress.,1,19
82,4,Hardy; improves soil structure.,1,20
83,5,Excellent drought resistance; fodder and vegetable use.,2,20
84,5,Perfect for semi-arid drylands; low input.,3,20
85,4,Can survive with minimal water; xerophytic.,4,20
87,4,Needs long hot growing season; high water input.,1,21
88,5,Major crop for Saharan Atlas foothills; heat/drought tolerant.,2,21
89,4,Reliable with irrigation; needs warm season.,3,21
90,3,Irrigation essential; high heat is beneficial.,4,21
91,4,Heat loving; nitrogen fixing; green manure.,1,22
92,5,Superior drought tolerance; staple for arid zones.,2,22
93,4,Quick maturity; handles heat and poor soil.,3,22
94,4,Thrives in desert heat with minimal irrigation.,4,22
96,4,Summer crop; needs regular water; fast growing.,1,23
97,4,Heat tolerant; requires frequent irrigation.,2,23
98,3,Needs warm start; protect from wind.,3,23
99,3,Grows fast with water; requires shading in peak heat.,4,23
101,3,Tropical crop; requires specific warm humid microclimate.,1,24
102,4,Temperature sensitive; avoid peak summer heat.,1,25
103,3,Grow in cooler season; irrigation essential.,2,25
104,3,Short season crop; needs consistent moisture.,3,25
106,4,Loves heat; drought tolerant once established.,1,26
107,5,Well suited for hot dry conditions; low water need.,2,26
108,4,Needs warm soil to germinate; hardy.,3,26
109,4,Desert adaptable; requires only light irrigation.,4,26
110,4,Short duration; warm season crop.,1,27
111,4,Drought tolerant; good for late summer.,2,27
112,4,Adaptable to semi-arid conditions.,3,27
113,3,Requires irrigation; tolerant of heat.,4,27
115,4,Needs sandy soil; warm growing season.,1,28
116,4,Drought tolerant; requires loose soil for pegging.,2,28
117,3,Needs long warm season; irrigation needed.,3,28
118,3,Possible with irrigation; high heat can affect flowering.,4,28
119,4,Extremely hardy; fodder and green manure.,1,29
120,5,Highly drought resistant; survives on marginal land.,2,29
121,5,Ideal for dryland farming; tough crop.,3,29
122,4,Thrives in arid conditions with minimal inputs.,4,29
124,4,Loves heat; needs space and water.,1,30
125,5,High sugar content due to heat; water efficient.,2,30
126,4,Excellent quality in warm days/cool nights.,3,30
127,4,Thrives in desert with irrigation; sweet fruit.,4,30
129,4,Winter planting; bulbing requires long days.,1,31
130,3,Needs irrigation; harvest before extreme summer heat.,2,31
131,4,Widely grown; tolerates cool weather well.,3,31
133,4,Short season; water efficient; bird food.,1,32
134,5,Extremely drought hardy; quick maturing.,2,32
135,5,Perfect for cold semi-arid steppes; low input.,3,32
136,4,Survives on very little water; catch crop.,4,32
138,4,Heat tolerant; fodder and grain.,1,33
139,5,King of arid lands; deep roots survive drought.,2,33
140,5,Highly reliable in marginal conditions.,3,33
141,5,Essential for oasis/desert fringes; low water.,4,33
143,5,Winter crop; vertical farming; soil enricher.,1,34
144,4,Requires cool season planting; moderate water.,2,34
145,4,Spring planting; likes cool weather.,3,34
147,4,Needs space; heat loving; stores well.,1,35
148,4,Drought tolerant once vines spread; irrigation helps.,2,35
149,3,Needs warmth; water access needed.,3,35
150,3,Grows well with water; shade leaves from scorch.,4,35
152,4,Fast growing; winter crop.,1,36
153,3,Winter growing; requires loose soil.,2,36
154,4,Cool season crop; crisp roots.,3,36
155,3,Winter crop only; water daily in sand.,4,36
157,4,Nutritious grain; tolerates poor soil.,1,37
158,4,Drought resistant; late season crop.,2,37
159,4,Reliable in semi-arid zones.,3,37
160,3,Needs some water; heat tolerant.,4,37
162,4,Perennial shrub; drought tolerant; soil improver.,1,38
163,5,Deep taproot suits dry climate; long season.,2,38
164,4,Hardy; windbreak potential; protein source.,3,38
165,4,Survives heat; useful in alley cropping.,4,38
167,4,Summer vine; needs trellis.,1,39
168,3,Heat tolerant; needs regular water.,2,39
169,3,Needs warm shelter; irrigation needed.,3,39
170,3,Grows with irrigation; handle heat.,4,39
171,4,Quick maturing; water efficient.,1,40
172,5,Excellent for dryland; bird resistant.,2,40
173,5,Hardy grain; reliable yield in steppes.,3,40
174,4,Drought survival; subsistence crop.,4,40
176,4,Used for greens and bulbs; fast crop.,1,41
177,3,Winter planting recommended.,2,41
178,4,Suitable for cooler areas; market demand.,3,41
179,3,Grow in winter; needs water.,4,41
181,4,Needs trellis; warm humid preferred.,1,42
182,3,Needs shading and water; heat tolerant.,2,42
183,3,Irrigation essential; protect from wind.,3,42
184,3,Requires constant moisture; handle heat.,4,42
185,4,Dual purpose (grain/fodder); drought hardy.,1,43
186,5,Strategic crop for arid zones; resilient.,2,43
187,5,Standard dryland crop; high biomass.,3,43
188,4,Reliable with irrigation; fodder production.,4,43
190,4,Needs warmth and water; nitrogen fixer.,1,44
191,3,Requires irrigation; heat tolerant varieties.,2,44
192,3,Needs warm microclimate; water stress risk.,3,44
194,4,Winter crop; salt tolerant.,1,45
195,4,Needs irrigation; industrial processing.,2,45
196,5,Major crop for steppe regions; cold tolerant.,3,45
198,3,Needs 12-18 months; high water user.,1,46
199,3,Limited to irrigated perimeters; high salinity risk.,2,46
200,4,Drought tolerant; deep roots; summer crop.,1,47
201,4,Performs well on dryland; high oil content.,2,47
202,4,Hardy; adapts to soil variations.,3,47
203,3,Needs irrigation; salt tolerant.,4,47
205,4,Heat loving; needs sandy soil; vine cover.,1,48
206,4,Drought tolerant once established; irrigate for yield.,2,48
207,3,Needs warm season; sand/loam soil.,3,48
208,3,Grows with water; good ground cover.,4,48
209,4,Summer crop; fast growing.,1,49
210,5,Loves heat; drought tolerant.,2,49
211,4,Needs warm days; sandy soil preferred.,3,49
212,4,Thrives in heat; irrigate regularly.,4,49
214,4,Summer staple; heat loving; water regularly.,1,50
215,4,High heat; requires mulching and irrigation.,2,50
216,3,Cool nights slow growth; protect from wind.,3,50
217,3,Winter growing preferred; avoid summer scorch.,4,50
219,4,Hardy grain; low nutrient requirement.,1,51
220,5,Drought survivor; marginal land use.,2,51
221,5,Ideal for degraded semi-arid soils.,3,51
222,4,Minimum water needed; erosion control.,4,51
224,4,Sandy soil; high heat requirement.,1,52
225,5,Desert adapted; deep roots; excellent quality fruit.,2,52
226,4,Needs warm season; sweet fruit in cool nights.,3,52
227,4,Classic desert crop with irrigation; low humidity reduces disease.,4,52
"""

# ========== 4. CropSoilTexture data (cropsoiltexture.csv) ==========
CROPSOILTEXTURE_CSV = """id,suitability_rank,note,crop_id,texture_name
1,1,Drains too quickly; unable to maintain flood conditions,1,Sand
2,1,Low water retention; unsustainable for paddy,1,Loamy Sand
3,2,Requires heavy irrigation; water stress risk,1,Sandy Loam
4,4,Good fertility but needs frequent irrigation to hold water,1,Loam
5,5,Excellent water holding capacity for paddy,1,Silt Loam
6,5,Ideal texture; retains standing water effectively,1,Silt
7,4,Retains moisture well; suitable for rainfed rice,1,Sandy Clay Loam
8,5,Excellent retention; standard for lowland rice,1,Clay Loam
9,5,High water retention; ideal for flooded culture,1,Silty Clay Loam
10,3,Retains water but hard to work; manageable,1,Sandy Clay
11,5,Perfect water retention; standard for rice paddies,1,Silty Clay
12,5,High water holding; prevents percolation; ideal for rice,1,Clay
13,3,Low water retention; requires frequent irrigation,2,Sand
14,3,Drains fast; nutrient leaching risk,2,Loamy Sand
15,4,Good drainage; acceptable with irrigation,2,Sandy Loam
16,5,Ideal balance of drainage and fertility,2,Loam
17,5,Excellent moisture retention; high yield potential,2,Silt Loam
18,4,Good retention; watch for compaction,2,Silt
19,4,Good structure; retains moisture for grain filling,2,Sandy Clay Loam
20,5,Excellent nutrient retention; standard for wheat,2,Clay Loam
21,4,Good moisture; ensure drainage to avoid waterlogging,2,Silty Clay Loam
22,2,Poor workability; risk of compaction,2,Sandy Clay
23,2,Poor drainage; hard to till when wet,2,Silty Clay
24,2,Heavy soil; difficult seedbed preparation,2,Clay
25,3,Low fertility; requires heavy fertilizer input,3,Sand
26,3,Drains too fast; drought risk during tasseling,3,Loamy Sand
27,4,Good drainage; warms quickly for planting,3,Sandy Loam
28,5,Ideal for root development and nutrient uptake,3,Loam
29,5,Excellent moisture retention; high productivity,3,Silt Loam
30,4,Good nutrients; risk of crusting affecting emergence,3,Silt
31,4,Retains moisture well; good for drylands,3,Sandy Clay Loam
32,5,High fertility; ideal with good drainage,3,Clay Loam
33,3,Can waterlog; ensure field drainage,3,Silty Clay Loam
34,2,Hard soil; restricts root expansion,3,Sandy Clay
35,2,Poor drainage; risk of root rot,3,Silty Clay
36,1,Compaction restricts roots; wetness delays planting,3,Clay
37,4,Deep roots access water; tolerate low fertility,4,Sand
38,4,Good drainage; ideal for arid zones,4,Loamy Sand
39,5,Ideal; well-drained; promotes deep taproot,4,Sandy Loam
40,5,Excellent growth; balances drainage and nutrients,4,Loam
41,4,Good fertility; ensure drainage,4,Silt Loam
42,3,Risk of compaction; taproot may struggle,4,Silt
43,4,Acceptable; tolerates poor drainage,4,Sandy Clay Loam
44,3,Manageable; avoid waterlogging,4,Clay Loam
45,2,Heavy soil; risk of root diseases,4,Silty Clay Loam
46,2,Poor aeration; difficult for root penetration,4,Sandy Clay
47,1,High water retention; risk of root rot,4,Silty Clay
48,1,Too compact; prevents taproot establishment,4,Clay
49,3,Requires frequent irrigation; low nutrient retention,5,Sand
50,3,Drought stress risk; needs organic matter,5,Loamy Sand
51,4,Good drainage; suits sprawling vines,5,Sandy Loam
52,5,Ideal fertility and moisture balance,5,Loam
53,5,Excellent moisture for large fruits,5,Silt Loam
54,4,Good water retention; heavy feeder suits it,5,Silt
55,4,Retains heat and water; good,5,Sandy Clay Loam
56,3,Acceptable if drainage is managed,5,Clay Loam
57,3,Risk of fruit rot in wet soil,5,Silty Clay Loam
58,2,Poor workability; compaction risk,5,Sandy Clay
59,2,High disease risk; poor drainage,5,Silty Clay
60,1,Waterlogging kills vines; avoid,5,Clay
61,4,Easy harvest; needs fertilizer and water,6,Sand
62,4,Good for root shape; needs organic matter,6,Loamy Sand
63,5,Ideal for uniform root development,6,Sandy Loam
64,5,Excellent texture; retains moisture for swelling,6,Loam
65,4,Good; risk of misshapen roots if compacted,6,Silt Loam
66,3,Risk of forking roots; manage compaction,6,Silt
67,4,Acceptable; roots may be smaller,6,Sandy Clay Loam
68,3,Heavy soil; roots struggle to expand,6,Clay Loam
69,2,High resistance to root growth; misshapen,6,Silty Clay Loam
70,2,Difficult harvest; forking common,6,Sandy Clay
71,1,Soil too heavy; restricts bulb formation,6,Silty Clay
72,1,Hard soil; roots will not form bulbs,6,Clay
73,4,Good drainage; requires nitrogen inputs,7,Sand
74,4,Suitable; drought tolerant crop,7,Loamy Sand
75,5,Ideal; deep roots penetrate easily,7,Sandy Loam
76,5,Excellent balance; fixes nitrogen effectively,7,Loam
77,4,Good retention; ensure drainage,7,Silt Loam
78,3,Can restrict root depth; acceptable,7,Silt
79,4,Suitable for rainfed conditions,7,Sandy Clay Loam
80,3,Drainage critical to avoid root rot,7,Clay Loam
81,2,Risk of fungal diseases in wet soil,7,Silty Clay Loam
82,2,Hard soil; affects root nodulation,7,Sandy Clay
83,1,Waterlogging risk; high failure rate,7,Silty Clay
84,1,Excessive moisture; root rot risk,7,Clay
85,3,Low fertility; needs frequent inputs,8,Sand
86,3,Drains fast; drought stress risk,8,Loamy Sand
87,4,Good drainage; warms soil quickly,8,Sandy Loam
88,5,Ideal for vigorous growth and pod set,8,Loam
89,5,Excellent moisture; good for summer crop,8,Silt Loam
90,4,Good fertility; watch for crusting,8,Silt
91,4,Retains moisture; acceptable,8,Sandy Clay Loam
92,3,Manageable; needs drainage,8,Clay Loam
93,2,Heavy soil; root rot risk,8,Silty Clay Loam
94,2,Poor aeration; stunts growth,8,Sandy Clay
95,1,Waterlogging common; avoid,8,Silty Clay
96,1,Too compact; poor root development,8,Clay
97,3,Requires heavy irrigation; low nutrients,9,Sand
98,3,Water stress limits fruit size,9,Loamy Sand
99,4,Good drainage; prefers warm soil,9,Sandy Loam
100,5,Ideal for vine growth and fruit production,9,Loam
101,5,Excellent water retention for fruits,9,Silt Loam
102,4,Good nutrients; ensure support for vines,9,Silt
103,4,Acceptable drainage; good yield,9,Sandy Clay Loam
104,3,Manageable with organic matter,9,Clay Loam
105,2,Disease risk increases,9,Silty Clay Loam
106,2,Poor structure; restricts roots,9,Sandy Clay
107,1,High water retention; root diseases,9,Silty Clay
108,1,Waterlogging kills vines,9,Clay
109,3,Low water retention; needs irrigation,10,Sand
110,3,Drains too fast; drought risk,10,Loamy Sand
111,4,Good for early growth; needs fertility,10,Sandy Loam
112,5,Ideal for nodulation and pod fill,10,Loam
113,5,Excellent moisture; boosts yield,10,Silt Loam
114,4,Good; ensure drainage,10,Silt
115,4,Acceptable; tolerates light drought,10,Sandy Clay Loam
116,3,Heavy soil; drainage needed,10,Clay Loam
117,2,Risk of waterlogging; root rot,10,Silty Clay Loam
118,2,Compaction limits roots,10,Sandy Clay
119,1,Avoid; poor drainage,10,Silty Clay
120,1,Waterlogging risk; crop failure,10,Clay
121,3,Needs constant water; low fertility,11,Sand
122,3,Drought stress; small fruits,11,Loamy Sand
123,4,Good drainage; prefers heat,11,Sandy Loam
124,5,Ideal for large fruit development,11,Loam
125,5,Excellent moisture retention,11,Silt Loam
126,4,Good fertility; watch compaction,11,Silt
127,4,Retains heat; good,11,Sandy Clay Loam
128,3,Acceptable; ensure drainage,11,Clay Loam
129,2,Risk of fungal issues,11,Silty Clay Loam
130,2,Poor workability,11,Sandy Clay
131,1,Waterlogging risk,11,Silty Clay
132,1,Soil too heavy; avoid,11,Clay
133,3,Low nutrients; needs heavy fertilizer,12,Sand
134,3,Drought stress; stunts growth,12,Loamy Sand
135,4,Good drainage; warms well,12,Sandy Loam
136,5,Ideal for root system and fruit set,12,Loam
137,5,Excellent moisture; high yield,12,Silt Loam
138,4,Good fertility; ensure drainage,12,Silt
139,4,Retains moisture; acceptable,12,Sandy Clay Loam
140,3,Manageable; good nutrient supply,12,Clay Loam
141,2,Heavy soil; root rot risk,12,Silty Clay Loam
142,2,Poor aeration; yield loss,12,Sandy Clay
143,1,Waterlogging; disease prone,12,Silty Clay
144,1,Compaction kills roots,12,Clay
145,3,Drains too fast; heads small,13,Sand
146,3,Needs constant water and nutrients,13,Loamy Sand
147,4,Good drainage; early maturity,13,Sandy Loam
148,5,Ideal for firm head formation,13,Loam
149,5,Excellent moisture; large heads,13,Silt Loam
150,4,Good; heavy feeder satisfied,13,Silt
151,4,Retains moisture; acceptable,13,Sandy Clay Loam
152,3,Heavy; manage drainage,13,Clay Loam
153,2,Risk of root diseases,13,Silty Clay Loam
154,2,Hard soil; restricts roots,13,Sandy Clay
155,1,Poor drainage; head rot,13,Silty Clay
156,1,Waterlogging; avoid,13,Clay
157,3,Drought stress; nutrient leaching,14,Sand
158,3,Needs frequent irrigation,14,Loamy Sand
159,4,Good drainage; prevents rot,14,Sandy Loam
160,5,Ideal texture for root establishment,14,Loam
161,5,Excellent moisture; uniform fruit,14,Silt Loam
162,4,Good; watch for compaction,14,Silt
163,4,Retains water; acceptable,14,Sandy Clay Loam
164,3,Heavy; needs drainage,14,Clay Loam
165,2,Disease risk increases,14,Silty Clay Loam
166,2,Poor aeration,14,Sandy Clay
167,1,Waterlogging risk; avoid,14,Silty Clay
168,1,Too compact; root issues,14,Clay
169,4,Easy harvest; needs fertilizer,15,Sand
170,4,Deep roots; good shape,15,Loamy Sand
171,5,Ideal for straight clean roots,15,Sandy Loam
172,5,Excellent balance; retains moisture,15,Loam
173,4,Good; risk of forking if compacted,15,Silt Loam
174,3,Forking risk; manage carefully,15,Silt
175,3,Resistance to root growth,15,Sandy Clay Loam
176,2,Heavy soil; misshapen roots,15,Clay Loam
177,1,Roots cannot expand; deform,15,Silty Clay Loam
178,1,Too hard; forking guaranteed,15,Sandy Clay
179,1,Severe forking; unmarketable,15,Silty Clay
180,1,Too compact; no root formation,15,Clay
181,4,Deep roots handle drought; low fertility ok,16,Sand
182,4,Good drainage; suitable for arid lands,16,Loamy Sand
183,5,Ideal for taproot development,16,Sandy Loam
184,5,Excellent growth and biomass,16,Loam
185,4,Good moisture; acceptable,16,Silt Loam
186,3,Compaction risk; taproot struggles,16,Silt
187,4,Tolerates heavy soil,16,Sandy Clay Loam
188,3,Manageable; deep roots help,16,Clay Loam
189,2,Heavy; drainage needed,16,Silty Clay Loam
190,2,Poor workability,16,Sandy Clay
191,1,Waterlogging kills plant,16,Silty Clay
192,1,Root rot risk; avoid,16,Clay
193,3,Drains too fast; poor curds,17,Sand
194,3,Needs heavy inputs,17,Loamy Sand
195,4,Good drainage; early crop,17,Sandy Loam
196,5,Ideal for curd development,17,Loam
197,5,Excellent moisture; quality curds,17,Silt Loam
198,4,Heavy feeder; good fertility,17,Silt
199,4,Acceptable; needs water,17,Sandy Clay Loam
200,3,Heavy; manage drainage,17,Clay Loam
201,2,Disease risk,17,Silty Clay Loam
202,2,Compaction issues,17,Sandy Clay
203,1,Root rot risk,17,Silty Clay
204,1,Waterlogging; avoid,17,Clay
205,3,Drought stress; low yield,18,Sand
206,3,Needs frequent water,18,Loamy Sand
207,4,Good drainage; warms well,18,Sandy Loam
208,5,Ideal for vigorous plants,18,Loam
209,5,Excellent moisture retention,18,Silt Loam
210,4,Good fertility; manageable,18,Silt
211,4,Retains moisture; acceptable,18,Sandy Clay Loam
212,3,Heavy; needs drainage,18,Clay Loam
213,2,Disease risk in wet soil,18,Silty Clay Loam
214,2,Compaction; stunts growth,18,Sandy Clay
215,1,Waterlogging; root rot,18,Silty Clay
216,1,Too heavy; avoid,18,Clay
217,3,Needs rich moist soil; drains too fast,19,Sand
218,3,Drought stress; vine dieback,19,Loamy Sand
219,4,Good; needs organic matter,19,Sandy Loam
220,5,Ideal for vigorous vines,19,Loam
221,5,Excellent moisture; large fruits,19,Silt Loam
222,4,Good fertility; ensure trellis drainage,19,Silt
223,3,Acceptable; manage water,19,Sandy Clay Loam
224,2,Risk of root rot,19,Clay Loam
225,1,Poor drainage; fungal issues,19,Silty Clay Loam
226,1,Too heavy; avoid,19,Sandy Clay
227,1,Waterlogging; vine death,19,Silty Clay
228,1,Not viable,19,Clay
229,4,Tolerates poor soil; drought hardy,20,Sand
230,4,Good for arid zones,20,Loamy Sand
231,5,Ideal; low input required,20,Sandy Loam
232,5,Excellent growth; fixes nitrogen,20,Loam
233,4,Good; retains moisture,20,Silt Loam
234,3,Acceptable; watch drainage,20,Silt
235,4,Suitable for drylands,20,Sandy Clay Loam
236,3,Manageable; deep roots,20,Clay Loam
237,2,Heavy; risk of rot,20,Silty Clay Loam
238,2,Poor workability,20,Sandy Clay
239,1,Waterlogging; crop failure,20,Silty Clay
240,1,Avoid,20,Clay
241,3,Needs irrigation; nutrient leaching,21,Sand
242,3,Drought risk; affects boll,21,Loamy Sand
243,4,Good drainage; early maturity,21,Sandy Loam
244,5,Ideal for deep taproot and yield,21,Loam
245,5,Excellent water retention,21,Silt Loam
246,4,Good fertility; manage drainage,21,Silt
247,4,Retains moisture; heavy soils ok,21,Sandy Clay Loam
248,5,High fertility; good for cotton,21,Clay Loam
249,3,Heavy; harvest delayed,21,Silty Clay Loam
250,2,Workability issues,21,Sandy Clay
251,1,Poor drainage; avoid,21,Silty Clay
252,1,Too wet; boll rot risk,21,Clay
253,4,Drought tolerant; low fertility ok,22,Sand
254,4,Good for dryland grazing,22,Loamy Sand
255,5,Ideal for beans and fodder,22,Sandy Loam
256,5,Excellent growth; high yield,22,Loam
257,4,Good moisture; acceptable,22,Silt Loam
258,3,Watch for compaction,22,Silt
259,4,Suitable for semi-arid,22,Sandy Clay Loam
260,3,Manageable; ensure drainage,22,Clay Loam
261,2,Disease risk,22,Silty Clay Loam
262,2,Compaction issues,22,Sandy Clay
263,1,Waterlogging; root rot,22,Silty Clay
264,1,Not recommended,22,Clay
265,3,Needs frequent irrigation,23,Sand
266,3,Drains too fast; bitter fruit,23,Loamy Sand
267,4,Good drainage; likes heat,23,Sandy Loam
268,5,Ideal for rapid growth,23,Loam
269,5,Excellent moisture; crisp fruit,23,Silt Loam
270,4,Good; heavy feeder,23,Silt
271,4,Acceptable; manage water,23,Sandy Clay Loam
272,3,Heavy; drainage needed,23,Clay Loam
273,2,Fungal disease risk,23,Silty Clay Loam
274,2,Hard soil; poor roots,23,Sandy Clay
275,1,Waterlogging; vine death,23,Silty Clay
276,1,Avoid,23,Clay
277,3,Needs moisture; looser soil preferred,24,Sand
278,3,Drought stress; small corm,24,Loamy Sand
279,4,Good drainage; easy harvest,24,Sandy Loam
280,5,Ideal for corm expansion,24,Loam
281,5,Excellent moisture; large size,24,Silt Loam
282,4,Good fertility; ensure drainage,24,Silt
283,3,Acceptable; harvest harder,24,Sandy Clay Loam
284,2,Heavy; corm deformity,24,Clay Loam
285,2,Risk of rot,24,Silty Clay Loam
286,1,Too hard; harvest impossible,24,Sandy Clay
287,1,Rot risk; avoid,24,Silty Clay
288,1,Not viable,24,Clay
289,3,Low fertility; drought stress,25,Sand
290,3,Needs constant water,25,Loamy Sand
291,4,Good drainage; early crop,25,Sandy Loam
292,5,Ideal for pod development,25,Loam
293,5,Excellent moisture; tender pods,25,Silt Loam
294,4,Good; watch for crusting,25,Silt
295,3,Retains water; acceptable,25,Sandy Clay Loam
296,2,Heavy; harvest issues,25,Clay Loam
297,2,Disease risk,25,Silty Clay Loam
298,1,Compaction; poor emergence,25,Sandy Clay
299,1,Waterlogging; avoid,25,Silty Clay
300,1,Not recommended,25,Clay
301,4,Tolerates drought; low fertility ok,26,Sand
302,4,Good drainage; warm soil,26,Loamy Sand
303,5,Ideal for root system,26,Sandy Loam
304,5,Excellent for oil content,26,Loam
305,4,Good; ensure drainage,26,Silt Loam
306,3,Acceptable; risk of compaction,26,Silt
307,4,Suitable for drylands,26,Sandy Clay Loam
308,3,Heavy; manage water,26,Clay Loam
309,2,Harvest difficulty,26,Silty Clay Loam
310,2,Poor aeration,26,Sandy Clay
311,1,Waterlogging kills crop,26,Silty Clay
312,1,Avoid,26,Clay
313,4,Drought hardy; low input,27,Sand
314,4,Good for short season,27,Loamy Sand
315,5,Ideal for nodulation,27,Sandy Loam
316,5,Excellent yield,27,Loam
317,4,Good moisture,27,Silt Loam
318,3,Manageable,27,Silt
319,4,Suitable,27,Sandy Clay Loam
320,3,Drainage needed,27,Clay Loam
321,2,Disease risk,27,Silty Clay Loam
322,2,Compaction,27,Sandy Clay
323,1,Waterlogging,27,Silty Clay
324,1,Avoid,27,Clay
325,4,Easy harvest; needs fertilizer,28,Sand
326,4,Good for pegging; loose soil,28,Loamy Sand
327,5,Ideal for pod development,28,Sandy Loam
328,5,Excellent balance,28,Loam
329,4,Good; compaction hurts pegs,28,Silt Loam
330,3,Harvest difficult; pods stain,28,Silt
331,3,Acceptable; hard harvest,28,Sandy Clay Loam
332,2,Poor drainage; pod rot,28,Clay Loam
333,1,Pegs cannot penetrate; rot,28,Silty Clay Loam
334,1,Too hard; harvest impossible,28,Sandy Clay
335,1,Avoid,28,Silty Clay
336,1,Not viable,28,Clay
337,4,Very drought tolerant; hardy,29,Sand
338,4,Good for marginal lands,29,Loamy Sand
339,5,Ideal for low rainfall areas,29,Sandy Loam
340,5,Excellent hardy crop,29,Loam
341,4,Good; acceptable,29,Silt Loam
342,3,Manageable,29,Silt
343,4,Suitable,29,Sandy Clay Loam
344,3,Tolerates heavy soil,29,Clay Loam
345,2,Drainage needed,29,Silty Clay Loam
346,2,Hard soil,29,Sandy Clay
347,1,Waterlogging risk,29,Silty Clay
348,1,Avoid,29,Clay
349,4,Needs irrigation; good drainage,30,Sand
350,4,Good for roots; water needed,30,Loamy Sand
351,5,Ideal for sweet fruit,30,Sandy Loam
352,5,Excellent moisture; high yield,30,Loam
353,5,Perfect for melons,30,Silt Loam
354,4,Good; ensure drainage,30,Silt
355,4,Acceptable,30,Sandy Clay Loam
356,3,Manageable; avoid wet feet,30,Clay Loam
357,2,Disease risk,30,Silty Clay Loam
358,2,Poor aeration,30,Sandy Clay
359,1,Waterlogging; fruit rot,30,Silty Clay
360,1,Avoid,30,Clay
361,4,Easy harvest; needs water/fert,31,Sand
362,4,Good bulb shape,31,Loamy Sand
363,5,Ideal for bulb expansion,31,Sandy Loam
364,5,Excellent quality,31,Loam
365,4,Good; risk of staining,31,Silt Loam
366,3,Heavy; difficult harvest,31,Silt
367,3,Harder harvest,31,Sandy Clay Loam
368,2,Bulbs deform; hard harvest,31,Clay Loam
369,1,Poor drainage; rot,31,Silty Clay Loam
370,1,Too hard; misshapen,31,Sandy Clay
371,1,Avoid,31,Silty Clay
372,1,Not viable,31,Clay
373,4,Drought tolerant; good for sand,32,Sand
374,4,Suitable for marginal land,32,Loamy Sand
375,5,Ideal for low input,32,Sandy Loam
376,5,Excellent yield,32,Loam
377,4,Good moisture,32,Silt Loam
378,3,Acceptable,32,Silt
379,4,Suitable,32,Sandy Clay Loam
380,3,Drainage needed,32,Clay Loam
381,2,Heavy,32,Silty Clay Loam
382,2,Hard soil,32,Sandy Clay
383,1,Waterlogging,32,Silty Clay
384,1,Avoid,32,Clay
385,5,Highly adapted to sand; drought hardy,33,Sand
386,5,Ideal for arid zones,33,Loamy Sand
387,5,Excellent for rainfed,33,Sandy Loam
388,4,Good; fertile,33,Loam
389,4,Good,33,Silt Loam
390,3,Acceptable,33,Silt
391,4,Suitable,33,Sandy Clay Loam
392,3,Heavy soil ok,33,Clay Loam
393,2,Risk of rot,33,Silty Clay Loam
394,2,Hard,33,Sandy Clay
395,1,Waterlogging,33,Silty Clay
396,1,Avoid,33,Clay
397,3,Drought stress; low yield,34,Sand
398,3,Needs water,34,Loamy Sand
399,4,Good drainage; early crop,34,Sandy Loam
400,5,Ideal for cool season,34,Loam
401,5,Excellent moisture,34,Silt Loam
402,4,Good; heavy feeder,34,Silt
403,4,Acceptable,34,Sandy Clay Loam
404,3,Manageable; drainage needed,34,Clay Loam
405,2,Root rot risk,34,Silty Clay Loam
406,2,Compaction,34,Sandy Clay
407,1,Wet soil; rot,34,Silty Clay
408,1,Avoid,34,Clay
409,3,Needs water; low fertility,35,Sand
410,3,Drought stress,35,Loamy Sand
411,4,Good drainage,35,Sandy Loam
412,5,Ideal for large fruits,35,Loam
413,5,Excellent moisture,35,Silt Loam
414,4,Good,35,Silt
415,4,Acceptable,35,Sandy Clay Loam
416,3,Manageable,35,Clay Loam
417,2,Disease risk,35,Silty Clay Loam
418,2,Hard soil,35,Sandy Clay
419,1,Waterlogging,35,Silty Clay
420,1,Avoid,35,Clay
421,4,Easy harvest; needs fert,36,Sand
422,4,Good shape,36,Loamy Sand
423,5,Ideal for roots,36,Sandy Loam
424,5,Excellent,36,Loam
425,4,Good; watch compaction,36,Silt Loam
426,3,Forking risk,36,Silt
427,3,Harder soil,36,Sandy Clay Loam
428,2,Misshapen roots,36,Clay Loam
429,1,Deformed roots,36,Silty Clay Loam
430,1,Too hard,36,Sandy Clay
431,1,Avoid,36,Silty Clay
432,1,Not viable,36,Clay
433,4,Drought tolerant; sandy ok,37,Sand
434,4,Suitable,37,Loamy Sand
435,5,Ideal for rainfed,37,Sandy Loam
436,5,Excellent,37,Loam
437,4,Good,37,Silt Loam
438,3,Acceptable,37,Silt
439,4,Suitable,37,Sandy Clay Loam
440,3,Heavy soil,37,Clay Loam
441,2,Wet soil,37,Silty Clay Loam
442,2,Hard,37,Sandy Clay
443,1,Waterlogging,37,Silty Clay
444,1,Avoid,37,Clay
445,4,Drought hardy; deep roots,38,Sand
446,4,Good for semi-arid,38,Loamy Sand
447,5,Ideal for long season,38,Sandy Loam
448,5,Excellent yield,38,Loam
449,4,Good moisture,38,Silt Loam
450,3,Acceptable,38,Silt
451,4,Suitable,38,Sandy Clay Loam
452,3,Manageable,38,Clay Loam
453,2,Heavy,38,Silty Clay Loam
454,2,Compaction,38,Sandy Clay
455,1,Waterlogging,38,Silty Clay
456,1,Avoid,38,Clay
457,3,Needs water,39,Sand
458,3,Drought risk,39,Loamy Sand
459,4,Good drainage,39,Sandy Loam
460,5,Ideal,39,Loam
461,5,Excellent,39,Silt Loam
462,4,Good,39,Silt
463,4,Acceptable,39,Sandy Clay Loam
464,3,Manageable,39,Clay Loam
465,2,Disease risk,39,Silty Clay Loam
466,2,Hard,39,Sandy Clay
467,1,Rot risk,39,Silty Clay
468,1,Avoid,39,Clay
469,4,Drought tolerant,40,Sand
470,4,Suitable,40,Loamy Sand
471,5,Ideal,40,Sandy Loam
472,5,Excellent,40,Loam
473,4,Good,40,Silt Loam
474,3,Acceptable,40,Silt
475,4,Suitable,40,Sandy Clay Loam
476,3,Heavy,40,Clay Loam
477,2,Wet,40,Silty Clay Loam
478,2,Hard,40,Sandy Clay
479,1,Waterlogging,40,Silty Clay
480,1,Avoid,40,Clay
481,4,Easy harvest; needs fert,41,Sand
482,4,Good shape,41,Loamy Sand
483,5,Ideal,41,Sandy Loam
484,5,Excellent,41,Loam
485,4,Good,41,Silt Loam
486,3,Compaction risk,41,Silt
487,3,Harder,41,Sandy Clay Loam
488,2,Deformity,41,Clay Loam
489,1,Rot,41,Silty Clay Loam
490,1,Too hard,41,Sandy Clay
491,1,Avoid,41,Silty Clay
492,1,Not viable,41,Clay
493,3,Needs water,42,Sand
494,3,Drought,42,Loamy Sand
495,4,Good,42,Sandy Loam
496,5,Ideal,42,Loam
497,5,Excellent,42,Silt Loam
498,4,Good,42,Silt
499,4,Acceptable,42,Sandy Clay Loam
500,3,Manageable,42,Clay Loam
501,2,Disease,42,Silty Clay Loam
502,2,Hard,42,Sandy Clay
503,1,Rot,42,Silty Clay
504,1,Avoid,42,Clay
505,4,Drought tolerant; deep roots,43,Sand
506,4,Suitable for dryland,43,Loamy Sand
507,5,Ideal for grain,43,Sandy Loam
508,5,Excellent yield,43,Loam
509,4,Good moisture,43,Silt Loam
510,3,Acceptable,43,Silt
511,4,Suitable,43,Sandy Clay Loam
512,4,Good for sorghum,43,Clay Loam
513,3,Heavy; manage drainage,43,Silty Clay Loam
514,2,Hard soil,43,Sandy Clay
515,1,Waterlogging,43,Silty Clay
516,1,Avoid,43,Clay
517,3,Low fertility; drought,44,Sand
518,3,Water stress,44,Loamy Sand
519,4,Good drainage,44,Sandy Loam
520,5,Ideal for beans,44,Loam
521,5,Excellent,44,Silt Loam
522,4,Good,44,Silt
523,4,Suitable,44,Sandy Clay Loam
524,3,Heavy; manage drainage,44,Clay Loam
525,2,Root rot risk,44,Silty Clay Loam
526,2,Compaction,44,Sandy Clay
527,1,Waterlogging,44,Silty Clay
528,1,Avoid,44,Clay
529,4,Needs water; easy harvest,45,Sand
530,4,Good for root,45,Loamy Sand
531,5,Ideal for sugar content,45,Sandy Loam
532,5,Excellent yield,45,Loam
533,4,Good moisture,45,Silt Loam
534,3,Compaction risk,45,Silt
535,4,Suitable,45,Sandy Clay Loam
536,3,Heavy; harvest harder,45,Clay Loam
537,2,Deformity risk,45,Silty Clay Loam
538,2,Hard harvest,45,Sandy Clay
539,1,Rot risk,45,Silty Clay
540,1,Avoid,45,Clay
541,3,Needs heavy irrigation,46,Sand
542,3,Water stress,46,Loamy Sand
543,4,Good drainage,46,Sandy Loam
544,5,Ideal for biomass,46,Loam
545,5,Excellent moisture,46,Silt Loam
546,4,Good retention,46,Silt
547,4,Suitable,46,Sandy Clay Loam
548,5,High fertility; good retention,46,Clay Loam
549,3,Heavy; manage water,46,Silty Clay Loam
550,2,Hard to till,46,Sandy Clay
551,1,Poor drainage,46,Silty Clay
552,1,Waterlogging; avoid,46,Clay
553,4,Drought tolerant; deep roots,47,Sand
554,4,Suitable,47,Loamy Sand
555,5,Ideal,47,Sandy Loam
556,5,Excellent,47,Loam
557,4,Good,47,Silt Loam
558,3,Acceptable,47,Silt
559,4,Suitable,47,Sandy Clay Loam
560,3,Heavy; acceptable,47,Clay Loam
561,2,Drainage needed,47,Silty Clay Loam
562,2,Compaction,47,Sandy Clay
563,1,Waterlogging,47,Silty Clay
564,1,Avoid,47,Clay
565,4,Easy harvest; needs fert,48,Sand
566,4,Good root shape,48,Loamy Sand
567,5,Ideal for tubers,48,Sandy Loam
568,5,Excellent yield,48,Loam
569,4,Good moisture,48,Silt Loam
570,3,Compaction; deformed tubers,48,Silt
571,3,Harder harvest,48,Sandy Clay Loam
572,2,Heavy; tuber deformity,48,Clay Loam
573,1,Rot risk,48,Silty Clay Loam
574,1,Too hard,48,Sandy Clay
575,1,Avoid,48,Silty Clay
576,1,Not viable,48,Clay
577,4,Drought tolerant,49,Sand
578,4,Suitable,49,Loamy Sand
579,5,Ideal,49,Sandy Loam
580,5,Excellent,49,Loam
581,4,Good,49,Silt Loam
582,3,Acceptable,49,Silt
583,4,Suitable,49,Sandy Clay Loam
584,3,Manageable,49,Clay Loam
585,2,Disease risk,49,Silty Clay Loam
586,2,Hard,49,Sandy Clay
587,1,Waterlogging,49,Silty Clay
588,1,Avoid,49,Clay
589,3,Low fertility; water stress,50,Sand
590,3,Needs frequent water,50,Loamy Sand
591,4,Good drainage; early,50,Sandy Loam
592,5,Ideal for roots,50,Loam
593,5,Excellent moisture,50,Silt Loam
594,4,Good; heavy feeder,50,Silt
595,4,Acceptable,50,Sandy Clay Loam
596,3,Heavy; manage water,50,Clay Loam
597,2,Fungal disease risk,50,Silty Clay Loam
598,2,Compaction,50,Sandy Clay
599,1,Rot risk,50,Silty Clay
600,1,Avoid,50,Clay
601,4,Hardy; drought tolerant,51,Sand
602,4,Suitable,51,Loamy Sand
603,5,Ideal,51,Sandy Loam
604,5,Excellent,51,Loam
605,4,Good,51,Silt Loam
606,3,Acceptable,51,Silt
607,4,Suitable,51,Sandy Clay Loam
608,3,Heavy,51,Clay Loam
609,2,Wet,51,Silty Clay Loam
610,2,Hard,51,Sandy Clay
611,1,Waterlogging,51,Silty Clay
612,1,Avoid,51,Clay
613,4,Needs water; sweet fruit,52,Sand
614,4,Good drainage,52,Loamy Sand
615,5,Ideal for melons,52,Sandy Loam
616,5,Excellent,52,Loam
617,4,Good moisture,52,Silt Loam
618,3,Manageable,52,Silt
619,4,Suitable,52,Sandy Clay Loam
620,3,Heavy; manage drainage,52,Clay Loam
621,2,Disease risk,52,Silty Clay Loam
622,2,Hard,52,Sandy Clay
623,1,Rot,52,Silty Clay
624,1,Avoid,52,Clay
"""

# ------------------------------------------------------------
# Helper to parse CSV string
def parse_csv(csv_string):
    return list(csv.DictReader(StringIO(csv_string.strip())))

# ------------------------------------------------------------
def main():
    if CLEAR_FIRST:
        print("Clearing existing data...")
        CropSoilTexture.objects.all().delete()
        CropClimate.objects.all().delete()
        Crop.objects.all().delete()
        Climate.objects.all().delete()

    print("Inserting Climate data...")
    climate_map = {}  # original id -> Climate instance
    for row in parse_csv(CLIMATE_CSV):
        obj, _ = Climate.objects.update_or_create(
            climate_zone=row['climate_zone'],
            defaults={'mineralization_factor': float(row['mineralization_factor'])}
        )
        climate_map[int(row['id'])] = obj

    print("Inserting Crop data...")
    crop_map = {}  # original id -> Crop instance
    for row in parse_csv(CROP_CSV):
        # Map CSV columns to model fields (note root_depth_max_cm/root_depth_min_cm order)
        obj, _ = Crop.objects.update_or_create(
            crop_name=row['crop_name'],
            defaults={
                'ph_min': float(row['ph_min']),
                'ph_max': float(row['ph_max']),
                'duration_days': int(row['duration_Days']),
                'temp_min': float(row['temp_min']),
                'temp_max': float(row['temp_max']),
                'water_min_mm': float(row['water_min_mm']),
                'water_max_mm': float(row['water_max_mm']),
                'humidity_min': float(row['humidity_min']),
                'humidity_max': float(row['humidity_max']),
                'n_kg_ha': float(row['n_kg_ha']),
                'p_kg_ha': float(row['p_kg_ha']),
                'k_kg_ha': float(row['k_kg_ha']),
                'sampling_depth_cm': float(row['sampling_depth_cm']),
                'sampling_shape': row['sampling_shape'],
                'sowing_month_start': int(row['sowing_month_start']),
                'sowing_month_end': int(row['sowing_month_end']),
                'note': row['note'],
                'root_depth_max_cm': float(row['root_depth_max_cm']),   # CSV order: max then min
                'root_depth_min_cm': float(row['root_depth_min_cm']),
            }
        )
        crop_map[int(row['id'])] = obj

    print("Inserting CropClimate data...")
    for row in parse_csv(CROPCLIMATE_CSV):
        crop_obj = crop_map.get(int(row['crop_id']))
        climate_obj = climate_map.get(int(row['climate_id']))
        if not crop_obj or not climate_obj:
            print(f"Warning: skipping CropClimate with crop_id={row['crop_id']}, climate_id={row['climate_id']} - missing references")
            continue
        CropClimate.objects.update_or_create(
            crop=crop_obj,
            climate=climate_obj,
            defaults={
                'rating': int(row['rating']),
                'note': row['Note']
            }
        )

    print("Inserting CropSoilTexture data...")
    for row in parse_csv(CROPSOILTEXTURE_CSV):
        crop_obj = crop_map.get(int(row['crop_id']))
        if not crop_obj:
            print(f"Warning: skipping CropSoilTexture with crop_id={row['crop_id']} - missing crop")
            continue
        CropSoilTexture.objects.update_or_create(
            crop=crop_obj,
            texture_name=row['texture_name'],
            defaults={
                'suitability_rank': int(row['suitability_rank']),
                'note': row['note']
            }
        )

    print("Data insertion completed successfully.")

if __name__ == '__main__':
    main()
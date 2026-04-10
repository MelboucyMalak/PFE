# insert_soil.py — في نفس مجلد manage.py
import os, sys

# ← غيّر الاسم حسب مجلد الـ settings عندك
# لو مجلدك اسمه crop_project → crop_project.settings
# لو اسمه crop_backend → crop_backend.settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_myProject.settings')

import django
django.setup()

from crop.models import Crop, SoilTexture, CropSoilTexture
from io import StringIO
import csv

# ─── 1. Insert 12 soil textures first ───
TEXTURES = [
    'Sand', 'Loamy Sand', 'Sandy Loam', 'Loam',
    'Silt Loam', 'Silt', 'Sandy Clay Loam', 'Clay Loam',
    'Silty Clay Loam', 'Sandy Clay', 'Silty Clay', 'Clay'
]

for t in TEXTURES:
    SoilTexture.objects.get_or_create(texture_class=t)
print(f"SoilTexture: {len(TEXTURES)} ready")

# ─── 2. Insert CropSoilTexture data ───
csv_data = """crop_id,texture_class,suitability_rank,note
1,Sand,1,Drains too quickly; unable to maintain flood conditions
1,Loamy Sand,1,Low water retention; unsustainable for paddy
1,Sandy Loam,2,Requires heavy irrigation; water stress risk
1,Loam,4,Good fertility but needs frequent irrigation to hold water
1,Silt Loam,5,Excellent water holding capacity for paddy
1,Silt,5,Ideal texture; retains standing water effectively
1,Sandy Clay Loam,4,Retains moisture well; suitable for rainfed rice
1,Clay Loam,5,Excellent retention; standard for lowland rice
1,Silty Clay Loam,5,High water retention; ideal for flooded culture
1,Sandy Clay,3,Retains water but hard to work; manageable
1,Silty Clay,5,Perfect water retention; standard for rice paddies
1,Clay,5,High water holding; prevents percolation; ideal for rice
2,Sand,3,Low water retention; requires frequent irrigation
2,Loamy Sand,3,Drains fast; nutrient leaching risk
2,Sandy Loam,4,Good drainage; acceptable with irrigation
2,Loam,5,Ideal balance of drainage and fertility
2,Silt Loam,5,Excellent moisture retention; high yield potential
2,Silt,4,Good retention; watch for compaction
2,Sandy Clay Loam,4,Good structure; retains moisture for grain filling
2,Clay Loam,5,Excellent nutrient retention; standard for wheat
2,Silty Clay Loam,4,Good moisture; ensure drainage to avoid waterlogging
2,Sandy Clay,2,Poor workability; risk of compaction
2,Silty Clay,2,Poor drainage; hard to till when wet
2,Clay,2,Heavy soil; difficult seedbed preparation
3,Sand,3,Low fertility; requires heavy fertilizer input
3,Loamy Sand,3,Drains too fast; drought risk during tasseling
3,Sandy Loam,4,Good drainage; warms quickly for planting
3,Loam,5,Ideal for root development and nutrient uptake
3,Silt Loam,5,Excellent moisture retention; high productivity
3,Silt,4,Good nutrients; risk of crusting affecting emergence
3,Sandy Clay Loam,4,Retains moisture well; good for drylands
3,Clay Loam,5,High fertility; ideal with good drainage
3,Silty Clay Loam,3,Can waterlog; ensure field drainage
3,Sandy Clay,2,Hard soil; restricts root expansion
3,Silty Clay,2,Poor drainage; risk of root rot
3,Clay,1,Compaction restricts roots; wetness delays planting
4,Sand,4,Deep roots access water; tolerate low fertility
4,Loamy Sand,4,Good drainage; ideal for arid zones
4,Sandy Loam,5,Ideal; well-drained; promotes deep taproot
4,Loam,5,Excellent growth; balances drainage and nutrients
4,Silt Loam,4,Good fertility; ensure drainage
4,Silt,3,Risk of compaction; taproot may struggle
4,Sandy Clay Loam,4,Acceptable; tolerates poor drainage
4,Clay Loam,3,Manageable; avoid waterlogging
4,Silty Clay Loam,2,Heavy soil; risk of root diseases
4,Sandy Clay,2,Poor aeration; difficult for root penetration
4,Silty Clay,1,High water retention; risk of root rot
4,Clay,1,Too compact; prevents taproot establishment
5,Sand,3,Requires frequent irrigation; low nutrient retention
5,Loamy Sand,3,Drought stress risk; needs organic matter
5,Sandy Loam,4,Good drainage; suits sprawling vines
5,Loam,5,Ideal fertility and moisture balance
5,Silt Loam,5,Excellent moisture for large fruits
5,Silt,4,Good water retention; heavy feeder suits it
5,Sandy Clay Loam,4,Retains heat and water; good
5,Clay Loam,3,Acceptable if drainage is managed
5,Silty Clay Loam,3,Risk of fruit rot in wet soil
5,Sandy Clay,2,Poor workability; compaction risk
5,Silty Clay,2,High disease risk; poor drainage
5,Clay,1,Waterlogging kills vines; avoid
6,Sand,4,Easy harvest; needs fertilizer and water
6,Loamy Sand,4,Good for root shape; needs organic matter
6,Sandy Loam,5,Ideal for uniform root development
6,Loam,5,Excellent texture; retains moisture for swelling
6,Silt Loam,4,Good; risk of misshapen roots if compacted
6,Silt,3,Risk of forking roots; manage compaction
6,Sandy Clay Loam,4,Acceptable; roots may be smaller
6,Clay Loam,3,Heavy soil; roots struggle to expand
6,Silty Clay Loam,2,High resistance to root growth; misshapen
6,Sandy Clay,2,Difficult harvest; forking common
6,Silty Clay,1,Soil too heavy; restricts bulb formation
6,Clay,1,Hard soil; roots will not form bulbs
7,Sand,4,Good drainage; requires nitrogen inputs
7,Loamy Sand,4,Suitable; drought tolerant crop
7,Sandy Loam,5,Ideal; deep roots penetrate easily
7,Loam,5,Excellent balance; fixes nitrogen effectively
7,Silt Loam,4,Good retention; ensure drainage
7,Silt,3,Can restrict root depth; acceptable
7,Sandy Clay Loam,4,Suitable for rainfed conditions
7,Clay Loam,3,Drainage critical to avoid root rot
7,Silty Clay Loam,2,Risk of fungal diseases in wet soil
7,Sandy Clay,2,Hard soil; affects root nodulation
7,Silty Clay,1,Waterlogging risk; high failure rate
7,Clay,1,Excessive moisture; root rot risk
8,Sand,3,Low fertility; needs frequent inputs
8,Loamy Sand,3,Drains fast; drought stress risk
8,Sandy Loam,4,Good drainage; warms soil quickly
8,Loam,5,Ideal for vigorous growth and pod set
8,Silt Loam,5,Excellent moisture; good for summer crop
8,Silt,4,Good fertility; watch for crusting
8,Sandy Clay Loam,4,Retains moisture; acceptable
8,Clay Loam,3,Manageable; needs drainage
8,Silty Clay Loam,2,Heavy soil; root rot risk
8,Sandy Clay,2,Poor aeration; stunts growth
8,Silty Clay,1,Waterlogging common; avoid
8,Clay,1,Too compact; poor root development
9,Sand,3,Requires heavy irrigation; low nutrients
9,Loamy Sand,3,Water stress limits fruit size
9,Sandy Loam,4,Good drainage; prefers warm soil
9,Loam,5,Ideal for vine growth and fruit production
9,Silt Loam,5,Excellent water retention for fruits
9,Silt,4,Good nutrients; ensure support for vines
9,Sandy Clay Loam,4,Acceptable drainage; good yield
9,Clay Loam,3,Manageable with organic matter
9,Silty Clay Loam,2,Disease risk increases
9,Sandy Clay,2,Poor structure; restricts roots
9,Silty Clay,1,High water retention; root diseases
9,Clay,1,Waterlogging kills vines
10,Sand,3,Low water retention; needs irrigation
10,Loamy Sand,3,Drains too fast; drought risk
10,Sandy Loam,4,Good for early growth; needs fertility
10,Loam,5,Ideal for nodulation and pod fill
10,Silt Loam,5,Excellent moisture; boosts yield
10,Silt,4,Good; ensure drainage
10,Sandy Clay Loam,4,Acceptable; tolerates light drought
10,Clay Loam,3,Heavy soil; drainage needed
10,Silty Clay Loam,2,Risk of waterlogging; root rot
10,Sandy Clay,2,Compaction limits roots
10,Silty Clay,1,Avoid; poor drainage
10,Clay,1,Waterlogging risk; crop failure
11,Sand,3,Needs constant water; low fertility
11,Loamy Sand,3,Drought stress; small fruits
11,Sandy Loam,4,Good drainage; prefers heat
11,Loam,5,Ideal for large fruit development
11,Silt Loam,5,Excellent moisture retention
11,Silt,4,Good fertility; watch compaction
11,Sandy Clay Loam,4,Retains heat; good
11,Clay Loam,3,Acceptable; ensure drainage
11,Silty Clay Loam,2,Risk of fungal issues
11,Sandy Clay,2,Poor workability
11,Silty Clay,1,Waterlogging risk
11,Clay,1,Soil too heavy; avoid
12,Sand,3,Low nutrients; needs heavy fertilizer
12,Loamy Sand,3,Drought stress; stunts growth
12,Sandy Loam,4,Good drainage; warms well
12,Loam,5,Ideal for root system and fruit set
12,Silt Loam,5,Excellent moisture; high yield
12,Silt,4,Good fertility; ensure drainage
12,Sandy Clay Loam,4,Retains moisture; acceptable
12,Clay Loam,3,Manageable; good nutrient supply
12,Silty Clay Loam,2,Heavy soil; root rot risk
12,Sandy Clay,2,Poor aeration; yield loss
12,Silty Clay,1,Waterlogging; disease prone
12,Clay,1,Compaction kills roots
13,Sand,3,Drains too fast; heads small
13,Loamy Sand,3,Needs constant water and nutrients
13,Sandy Loam,4,Good drainage; early maturity
13,Loam,5,Ideal for firm head formation
13,Silt Loam,5,Excellent moisture; large heads
13,Silt,4,Good; heavy feeder satisfied
13,Sandy Clay Loam,4,Retains moisture; acceptable
13,Clay Loam,3,Heavy; manage drainage
13,Silty Clay Loam,2,Risk of root diseases
13,Sandy Clay,2,Hard soil; restricts roots
13,Silty Clay,1,Poor drainage; head rot
13,Clay,1,Waterlogging; avoid
14,Sand,3,Drought stress; nutrient leaching
14,Loamy Sand,3,Needs frequent irrigation
14,Sandy Loam,4,Good drainage; prevents rot
14,Loam,5,Ideal texture for root establishment
14,Silt Loam,5,Excellent moisture; uniform fruit
14,Silt,4,Good; watch for compaction
14,Sandy Clay Loam,4,Retains water; acceptable
14,Clay Loam,3,Heavy; needs drainage
14,Silty Clay Loam,2,Disease risk increases
14,Sandy Clay,2,Poor aeration
14,Silty Clay,1,Waterlogging risk; avoid
14,Clay,1,Too compact; root issues
15,Sand,4,Easy harvest; needs fertilizer
15,Loamy Sand,4,Deep roots; good shape
15,Sandy Loam,5,Ideal for straight clean roots
15,Loam,5,Excellent balance; retains moisture
15,Silt Loam,4,Good; risk of forking if compacted
15,Silt,3,Forking risk; manage carefully
15,Sandy Clay Loam,3,Resistance to root growth
15,Clay Loam,2,Heavy soil; misshapen roots
15,Silty Clay Loam,1,Roots cannot expand; deform
15,Sandy Clay,1,Too hard; forking guaranteed
15,Silty Clay,1,Severe forking; unmarketable
15,Clay,1,Too compact; no root formation
16,Sand,4,Deep roots handle drought; low fertility ok
16,Loamy Sand,4,Good drainage; suitable for arid lands
16,Sandy Loam,5,Ideal for taproot development
16,Loam,5,Excellent growth and biomass
16,Silt Loam,4,Good moisture; acceptable
16,Silt,3,Compaction risk; taproot struggles
16,Sandy Clay Loam,4,Tolerates heavy soil
16,Clay Loam,3,Manageable; deep roots help
16,Silty Clay Loam,2,Heavy; drainage needed
16,Sandy Clay,2,Poor workability
16,Silty Clay,1,Waterlogging kills plant
16,Clay,1,Root rot risk; avoid
17,Sand,3,Drains too fast; poor curds
17,Loamy Sand,3,Needs heavy inputs
17,Sandy Loam,4,Good drainage; early crop
17,Loam,5,Ideal for curd development
17,Silt Loam,5,Excellent moisture; quality curds
17,Silt,4,Heavy feeder; good fertility
17,Sandy Clay Loam,4,Acceptable; needs water
17,Clay Loam,3,Heavy; manage drainage
17,Silty Clay Loam,2,Disease risk
17,Sandy Clay,2,Compaction issues
17,Silty Clay,1,Root rot risk
17,Clay,1,Waterlogging; avoid
18,Sand,3,Drought stress; low yield
18,Loamy Sand,3,Needs frequent water
18,Sandy Loam,4,Good drainage; warms well
18,Loam,5,Ideal for vigorous plants
18,Silt,5,Excellent moisture retention
18,Silt,4,Good fertility; manageable
18,Sandy Clay Loam,4,Retains moisture; acceptable
18,Clay Loam,3,Heavy; needs drainage
18,Silty Clay Loam,2,Disease risk in wet soil
18,Sandy Clay,2,Compaction; stunts growth
18,Silty Clay,1,Waterlogging; root rot
18,Clay,1,Too heavy; avoid
19,Sand,3,Needs rich moist soil; drains too fast
19,Loamy Sand,3,Drought stress; vine dieback
19,Sandy Loam,4,Good; needs organic matter
19,Loam,5,Ideal for vigorous vines
19,Silt Loam,5,Excellent moisture; large fruits
19,Silt,4,Good fertility; ensure trellis drainage
19,Sandy Clay Loam,3,Acceptable; manage water
19,Clay Loam,2,Risk of root rot
19,Silty Clay Loam,1,Poor drainage; fungal issues
19,Sandy Clay,1,Too heavy; avoid
19,Silty Clay,1,Waterlogging; vine death
19,Clay,1,Not viable
20,Sand,4,Tolerates poor soil; drought hardy
20,Loamy Sand,4,Good for arid zones
20,Sandy Loam,5,Ideal; low input required
20,Loam,5,Excellent growth; fixes nitrogen
20,Silt Loam,4,Good; retains moisture
20,Silt,3,Acceptable; watch drainage
20,Sandy Clay Loam,4,Suitable for drylands
20,Clay Loam,3,Manageable; deep roots
20,Silty Clay Loam,2,Heavy; risk of rot
20,Sandy Clay,2,Poor workability
20,Silty Clay,1,Waterlogging; crop failure
20,Clay,1,Avoid
21,Sand,3,Needs irrigation; nutrient leaching
21,Loamy Sand,3,Drought risk; affects boll
21,Sandy Loam,4,Good drainage; early maturity
21,Loam,5,Ideal for deep taproot and yield
21,Silt Loam,5,Excellent water retention
21,Silt,4,Good fertility; manage drainage
21,Sandy Clay Loam,4,Retains moisture; heavy soils ok
21,Clay Loam,5,High fertility; good for cotton
21,Silty Clay Loam,3,Heavy; harvest delayed
21,Sandy Clay,2,Workability issues
21,Silty Clay,1,Poor drainage; avoid
21,Clay,1,Too wet; boll rot risk
22,Sand,4,Drought tolerant; low fertility ok
22,Loamy Sand,4,Good for dryland grazing
22,Sandy Loam,5,Ideal for beans and fodder
22,Loam,5,Excellent growth; high yield
22,Silt Loam,4,Good moisture; acceptable
22,Silt,3,Watch for compaction
22,Sandy Clay Loam,4,Suitable for semi-arid
22,Clay Loam,3,Manageable; ensure drainage
22,Silty Clay Loam,2,Disease risk
22,Sandy Clay,2,Compaction issues
22,Silty Clay,1,Waterlogging; root rot
22,Clay,1,Not recommended
23,Sand,3,Needs frequent irrigation
23,Loamy Sand,3,Drains too fast; bitter fruit
23,Sandy Loam,4,Good drainage; likes heat
23,Loam,5,Ideal for rapid growth
23,Silt Loam,5,Excellent moisture; crisp fruit
23,Silt,4,Good; heavy feeder
23,Sandy Clay Loam,4,Acceptable; manage water
23,Clay Loam,3,Heavy; drainage needed
23,Silty Clay Loam,2,Fungal disease risk
23,Sandy Clay,2,Hard soil; poor roots
23,Silty Clay,1,Waterlogging; vine death
23,Clay,1,Avoid
24,Sand,3,Needs moisture; looser soil preferred
24,Loamy Sand,3,Drought stress; small corm
24,Sandy Loam,4,Good drainage; easy harvest
24,Loam,5,Ideal for corm expansion
24,Silt Loam,5,Excellent moisture; large size
24,Silt,4,Good fertility; ensure drainage
24,Sandy Clay Loam,3,Acceptable; harvest harder
24,Clay Loam,2,Heavy; corm deformity
24,Silty Clay Loam,2,Risk of rot
24,Sandy Clay,1,Too hard; harvest impossible
24,Silty Clay,1,Rot risk; avoid
24,Clay,1,Not viable
25,Sand,3,Low fertility; drought stress
25,Loamy Sand,3,Needs constant water
25,Sandy Loam,4,Good drainage; early crop
25,Loam,5,Ideal for pod development
25,Silt Loam,5,Excellent moisture; tender pods
25,Silt,4,Good; watch for crusting
25,Sandy Clay Loam,3,Retains water; acceptable
25,Clay Loam,2,Heavy; harvest issues
25,Silty Clay Loam,2,Disease risk
25,Sandy Clay,1,Compaction; poor emergence
25,Silty Clay,1,Waterlogging; avoid
25,Clay,1,Not recommended
26,Sand,4,Tolerates drought; low fertility ok
26,Loamy Sand,4,Good drainage; warm soil
26,Sandy Loam,5,Ideal for root system
26,Loam,5,Excellent for oil content
26,Silt Loam,4,Good; ensure drainage
26,Silt,3,Acceptable; risk of compaction
26,Sandy Clay Loam,4,Suitable for drylands
26,Clay Loam,3,Heavy; manage water
26,Silty Clay Loam,2,Harvest difficulty
26,Sandy Clay,2,Poor aeration
26,Silty Clay,1,Waterlogging kills crop
26,Clay,1,Avoid
27,Sand,4,Drought hardy; low input
27,Loamy Sand,4,Good for short season
27,Sandy Loam,5,Ideal for nodulation
27,Loam,5,Excellent yield
27,Silt Loam,4,Good moisture
27,Silt,3,Manageable
27,Sandy Clay Loam,4,Suitable
27,Clay Loam,3,Drainage needed
27,Silty Clay Loam,2,Disease risk
27,Sandy Clay,2,Compaction
27,Silty Clay,1,Waterlogging
27,Clay,1,Avoid
28,Sand,4,Easy harvest; needs fertilizer
28,Loamy Sand,4,Good for pegging; loose soil
28,Sandy Loam,5,Ideal for pod development
28,Loam,5,Excellent balance
28,Silt,4,Good; compaction hurts pegs
28,Silt,3,Harvest difficult; pods stain
28,Sandy Clay Loam,3,Acceptable; hard harvest
28,Clay Loam,2,Poor drainage; pod rot
28,Silty Clay Loam,1,Pegs cannot penetrate; rot
28,Sandy Clay,1,Too hard; harvest impossible
28,Silty Clay,1,Avoid
28,Clay,1,Not viable
29,Sand,4,Very drought tolerant; hardy
29,Loamy Sand,4,Good for marginal lands
29,Sandy Loam,5,Ideal for low rainfall areas
29,Loam,5,Excellent hardy crop
29,Silt,4,Good; acceptable
29,Silt,3,Manageable
29,Sandy Clay Loam,4,Suitable
29,Clay Loam,3,Tolerates heavy soil
29,Silty Clay Loam,2,Drainage needed
29,Sandy Clay,2,Hard soil
29,Silty Clay,1,Waterlogging risk
29,Clay,1,Avoid
30,Sand,4,Needs irrigation; good drainage
30,Loamy Sand,4,Good for roots; water needed
30,Sandy Loam,5,Ideal for sweet fruit
30,Loam,5,Excellent moisture; high yield
30,Silt,5,Perfect for melons
30,Silt,4,Good; ensure drainage
30,Sandy Clay Loam,4,Acceptable
30,Clay Loam,3,Manageable; avoid wet feet
30,Silty Clay Loam,2,Disease risk
30,Sandy Clay,2,Poor aeration
30,Silty Clay,1,Waterlogging; fruit rot
30,Clay,1,Avoid
31,Sand,4,Easy harvest; needs water/fert
31,Loamy Sand,4,Good bulb shape
31,Sandy Loam,5,Ideal for bulb expansion
31,Loam,5,Excellent quality
31,Silt,4,Good; risk of staining
31,Silt,3,Heavy; difficult harvest
31,Sandy Clay Loam,3,Harder harvest
31,Clay Loam,2,Bulbs deform; hard harvest
31,Silty Clay Loam,1,Poor drainage; rot
31,Sandy Clay,1,Too hard; misshapen
31,Silty Clay,1,Avoid
31,Clay,1,Not viable
32,Sand,4,Drought tolerant; good for sand
32,Loamy Sand,4,Suitable for marginal land
32,Sandy Loam,5,Ideal for low input
32,Loam,5,Excellent yield
32,Silt,4,Good moisture
32,Silt,3,Acceptable
32,Sandy Clay Loam,4,Suitable
32,Clay Loam,3,Drainage needed
32,Silty Clay Loam,2,Heavy
32,Sandy Clay,2,Hard soil
32,Silty Clay,1,Waterlogging
32,Clay,1,Avoid
33,Sand,5,Highly adapted to sand; drought hardy
33,Loamy Sand,5,Ideal for arid zones
33,Sandy Loam,5,Excellent for rainfed
33,Loam,4,Good; fertile
33,Silt,4,Good
33,Silt,3,Acceptable
33,Sandy Clay Loam,4,Suitable
33,Clay Loam,3,Heavy soil ok
33,Silty Clay Loam,2,Risk of rot
33,Sandy Clay,2,Hard
33,Silty Clay,1,Waterlogging
33,Clay,1,Avoid
34,Sand,3,Drought stress; low yield
34,Loamy Sand,3,Needs water
34,Sandy Loam,4,Good drainage; early crop
34,Loam,5,Ideal for cool season
34,Silt,5,Excellent moisture
34,Silt,4,Good; heavy feeder
34,Sandy Clay Loam,4,Acceptable
34,Clay Loam,3,Manageable; drainage needed
34,Silty Clay Loam,2,Root rot risk
34,Sandy Clay,2,Compaction
34,Silty Clay,1,Wet soil; rot
34,Clay,1,Avoid
35,Sand,3,Needs water; low fertility
35,Loamy Sand,3,Drought stress
35,Sandy Loam,4,Good drainage
35,Loam,5,Ideal for large fruits
35,Silt Loam,5,Excellent moisture
35,Silt,4,Good
35,Sandy Clay Loam,4,Acceptable
35,Clay Loam,3,Manageable
35,Silty Clay Loam,2,Disease risk
35,Sandy Clay,2,Hard soil
35,Silty Clay,1,Waterlogging
35,Clay,1,Avoid
36,Sand,4,Easy harvest; needs fert
36,Loamy Sand,4,Good shape
36,Sandy Loam,5,Ideal for roots
36,Loam,5,Excellent
36,Silt,4,Good; watch compaction
36,Silt,3,Forking risk
36,Sandy Clay Loam,3,Harder soil
36,Clay Loam,2,Misshapen roots
36,Silty Clay Loam,1,Deformed roots
36,Sandy Clay,1,Too hard
36,Silty Clay,1,Avoid
36,Clay,1,Not viable
37,Sand,4,Drought tolerant; sandy ok
37,Loamy Sand,4,Suitable
37,Sandy Loam,5,Ideal for rainfed
37,Loam,5,Excellent
37,Silt,4,Good
37,Silt,3,Acceptable
37,Sandy Clay Loam,4,Suitable
37,Clay Loam,3,Heavy soil
37,Silty Clay Loam,2,Wet soil
37,Sandy Clay,2,Hard
37,Silty Clay,1,Waterlogging
37,Clay,1,Avoid
38,Sand,4,Drought hardy; deep roots
38,Loamy Sand,4,Good for semi-arid
38,Sandy Loam,5,Ideal for long season
38,Loam,5,Excellent yield
38,Silt,4,Good moisture
38,Silt,3,Acceptable
38,Sandy Clay Loam,4,Suitable
38,Clay Loam,3,Manageable
38,Silty Clay Loam,2,Heavy
38,Sandy Clay,2,Compaction
38,Silty Clay,1,Waterlogging
38,Clay,1,Avoid
39,Sand,3,Needs water
39,Loamy Sand,3,Drought risk
39,Sandy Loam,4,Good drainage
39,Loam,5,Ideal
39,Silt Loam,5,Excellent
39,Silt,4,Good
39,Sandy Clay Loam,4,Acceptable
39,Clay Loam,3,Manageable
39,Silty Clay Loam,2,Disease risk
39,Sandy Clay,2,Hard
39,Silty Clay,1,Rot risk
39,Clay,1,Avoid
40,Sand,4,Drought tolerant
40,Loamy Sand,4,Suitable
40,Sandy Loam,5,Ideal
40,Loam,5,Excellent
40,Silt,4,Good
40,Silt,3,Acceptable
40,Sandy Clay Loam,4,Suitable
40,Clay Loam,3,Heavy
40,Silty Clay Loam,2,Wet
40,Sandy Clay,2,Hard
40,Silty Clay,1,Waterlogging
40,Clay,1,Avoid
41,Sand,4,Easy harvest; needs fert
41,Loamy Sand,4,Good shape
41,Sandy Loam,5,Ideal
41,Loam,5,Excellent
41,Silt,4,Good
41,Silt,3,Compaction risk
41,Sandy Clay Loam,3,Harder
41,Clay Loam,2,Deformity
41,Silty Clay Loam,1,Rot
41,Sandy Clay,1,Too hard
41,Silty Clay,1,Avoid
41,Clay,1,Not viable
42,Sand,3,Needs water
42,Loamy Sand,3,Drought
42,Sandy Loam,4,Good
42,Loam,5,Ideal
42,Silt Loam,5,Excellent
42,Silt,4,Good
42,Sandy Clay Loam,4,Acceptable
42,Clay Loam,3,Manageable
42,Silty Clay Loam,2,Disease
42,Sandy Clay,2,Hard
42,Silty Clay,1,Rot
42,Clay,1,Avoid
43,Sand,4,Drought tolerant; deep roots
43,Loamy Sand,4,Suitable for dryland
43,Sandy Loam,5,Ideal for grain
43,Loam,5,Excellent yield
43,Silt,4,Good moisture
43,Silt,3,Acceptable
43,Sandy Clay Loam,4,Suitable
43,Clay Loam,4,Good for sorghum
43,Silty Clay Loam,3,Heavy; manage drainage
43,Sandy Clay,2,Hard soil
43,Silty Clay,1,Waterlogging
43,Clay,1,Avoid
44,Sand,3,Low fertility; drought
44,Loamy Sand,3,Water stress
44,Sandy Loam,4,Good drainage
44,Loam,5,Ideal for beans
44,Silt Loam,5,Excellent
44,Silt,4,Good
44,Sandy Clay Loam,4,Suitable
44,Clay Loam,3,Heavy; manage drainage
44,Silty Clay Loam,2,Root rot risk
44,Sandy Clay,2,Compaction
44,Silty Clay,1,Waterlogging
44,Clay,1,Avoid
45,Sand,4,Needs water; easy harvest
45,Loamy Sand,4,Good for root
45,Sandy Loam,5,Ideal for sugar content
45,Loam,5,Excellent yield
45,Silt,4,Good moisture
45,Silt,3,Compaction risk
45,Sandy Clay Loam,4,Suitable
45,Clay Loam,3,Heavy; harvest harder
45,Silty Clay Loam,2,Deformity risk
45,Sandy Clay,2,Hard harvest
45,Silty Clay,1,Rot risk
45,Clay,1,Avoid
46,Sand,3,Needs heavy irrigation
46,Loamy Sand,3,Water stress
46,Sandy Loam,4,Good drainage
46,Loam,5,Ideal for biomass
46,Silt Loam,5,Excellent moisture
46,Silt,4,Good retention
46,Sandy Clay Loam,4,Suitable
46,Clay Loam,5,High fertility; good retention
46,Silty Clay Loam,3,Heavy; manage water
46,Sandy Clay,2,Hard to till
46,Silty Clay,1,Poor drainage
46,Clay,1,Waterlogging; avoid
47,Sand,4,Drought tolerant; deep roots
47,Loamy Sand,4,Suitable
47,Sandy Loam,5,Ideal
47,Loam,5,Excellent
47,Silt,4,Good
47,Silt,3,Acceptable
47,Sandy Clay Loam,4,Suitable
47,Clay Loam,3,Heavy; acceptable
47,Silty Clay Loam,2,Drainage needed
47,Sandy Clay,2,Compaction
47,Silty Clay,1,Waterlogging
47,Clay,1,Avoid
48,Sand,4,Easy harvest; needs fert
48,Loamy Sand,4,Good root shape
48,Sandy Loam,5,Ideal for tubers
48,Loam,5,Excellent yield
48,Silt,4,Good moisture
48,Silt,3,Compaction; deformed tubers
48,Sandy Clay Loam,3,Harder harvest
48,Clay Loam,2,Heavy; tuber deformity
48,Silty Clay Loam,1,Rot risk
48,Sandy Clay,1,Too hard
48,Silty Clay,1,Avoid
48,Clay,1,Not viable
49,Sand,4,Drought tolerant
49,Loamy Sand,4,Suitable
49,Sandy Loam,5,Ideal
49,Loam,5,Excellent
49,Silt,4,Good
49,Silt,3,Acceptable
49,Sandy Clay Loam,4,Suitable
49,Clay Loam,3,Manageable
49,Silty Clay Loam,2,Disease risk
49,Sandy Clay,2,Hard
49,Silty Clay,1,Waterlogging
49,Clay,1,Avoid
50,Sand,3,Low fertility; water stress
50,Loamy Sand,3,Needs frequent water
50,Sandy Loam,4,Good drainage; early
50,Loam,5,Ideal for roots
50,Silt Loam,5,Excellent moisture
50,Silt,4,Good; heavy feeder
50,Sandy Clay Loam,4,Acceptable
50,Clay Loam,3,Heavy; manage water
50,Silty Clay Loam,2,Fungal disease risk
50,Sandy Clay,2,Compaction
50,Silty Clay,1,Rot risk
50,Clay,1,Avoid
51,Sand,4,Hardy; drought tolerant
51,Loamy Sand,4,Suitable
51,Sandy Loam,5,Ideal
51,Loam,5,Excellent
51,Silt,4,Good
51,Silt,3,Acceptable
51,Sandy Clay Loam,4,Suitable
51,Clay Loam,3,Heavy
51,Silty Clay Loam,2,Wet
51,Sandy Clay,2,Hard
51,Silty Clay,1,Waterlogging
51,Clay,1,Avoid
52,Sand,4,Needs water; sweet fruit
52,Loamy Sand,4,Good drainage
52,Sandy Loam,5,Ideal for melons
52,Loam,5,Excellent
52,Silt,4,Good moisture
52,Silt,3,Manageable
52,Sandy Clay Loam,4,Suitable
52,Clay Loam,3,Heavy; manage drainage
52,Silty Clay Loam,2,Disease risk
52,Sandy Clay,2,Hard
52,Silty Clay,1,Rot
52,Clay,1,Avoid"""

f = StringIO(csv_data)
reader = csv.DictReader(f)
count = 0
for row in reader:
    crop_obj = Crop.objects.get(id=int(row['crop_id']))
    texture_obj = SoilTexture.objects.get(texture_class=row['texture_class'])
    CropSoilTexture.objects.get_or_create(
        crop=crop_obj,
        soil_texture=texture_obj,
        defaults={
            'suitability_rank': int(row['suitability_rank']),
            'note': row['note']
        }
    )
    count += 1

print(f"CropSoilTexture: {count} rows inserted!")
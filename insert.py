import os
import django

# 1. Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      '_myProject.settings')  # <--- CHANGE 'your_project_name' to your actual project folder name
django.setup()

from crop.models import CropSoilTexture, Crop  # <--- CHANGE 'your_app_name' to your actual app name

# 2. The raw data string
raw_data = """1 | 1 | Sand | 1 | Drains too quickly; unable to maintain flood conditions
2 | 1 | Loamy Sand | 1 | Low water retention; unsustainable for paddy
3 | 1 | Sandy Loam | 2 | Requires heavy irrigation; water stress risk
4 | 1 | Loam | 4 | Good fertility but needs frequent irrigation to hold water
5 | 1 | Silt Loam | 5 | Excellent water holding capacity for paddy
6 | 1 | Silt | 5 | Ideal texture; retains standing water effectively
7 | 1 | Sandy Clay Loam | 4 | Retains moisture well; suitable for rainfed rice
8 | 1 | Clay Loam | 5 | Excellent retention; standard for lowland rice
9 | 1 | Silty Clay Loam | 5 | High water retention; ideal for flooded culture
10 | 1 | Sandy Clay | 3 | Retains water but hard to work; manageable
11 | 1 | Silty Clay | 5 | Perfect water retention; standard for rice paddies
12 | 1 | Clay | 5 | High water holding; prevents percolation; ideal for rice
13 | 2 | Sand | 3 | Low water retention; requires frequent irrigation
14 | 2 | Loamy Sand | 3 | Drains fast; nutrient leaching risk
15 | 2 | Sandy Loam | 4 | Good drainage; acceptable with irrigation
16 | 2 | Loam | 5 | Ideal balance of drainage and fertility
17 | 2 | Silt Loam | 5 | Excellent moisture retention; high yield potential
18 | 2 | Silt | 4 | Good retention; watch for compaction
19 | 2 | Sandy Clay Loam | 4 | Good structure; retains moisture for grain filling
20 | 2 | Clay Loam | 5 | Excellent nutrient retention; standard for wheat
21 | 2 | Silty Clay Loam | 4 | Good moisture; ensure drainage to avoid waterlogging
22 | 2 | Sandy Clay | 2 | Poor workability; risk of compaction
23 | 2 | Silty Clay | 2 | Poor drainage; hard to till when wet
24 | 2 | Clay | 2 | Heavy soil; difficult seedbed preparation
25 | 3 | Sand | 3 | Low fertility; requires heavy fertilizer input
26 | 3 | Loamy Sand | 3 | Drains too fast; drought risk during tasseling
27 | 3 | Sandy Loam | 4 | Good drainage; warms quickly for planting
28 | 3 | Loam | 5 | Ideal for root development and nutrient uptake
29 | 3 | Silt Loam | 5 | Excellent moisture retention; high productivity
30 | 3 | Silt | 4 | Good nutrients; risk of crusting affecting emergence
31 | 3 | Sandy Clay Loam | 4 | Retains moisture well; good for drylands
32 | 3 | Clay Loam | 5 | High fertility; ideal with good drainage
33 | 3 | Silty Clay Loam | 3 | Can waterlog; ensure field drainage
34 | 3 | Sandy Clay | 2 | Hard soil; restricts root expansion
35 | 3 | Silty Clay | 2 | Poor drainage; risk of root rot
36 | 3 | Clay | 1 | Compaction restricts roots; wetness delays planting
37 | 4 | Sand | 4 | Deep roots access water; tolerate low fertility
38 | 4 | Loamy Sand | 4 | Good drainage; ideal for arid zones
39 | 4 | Sandy Loam | 5 | Ideal; well-drained; promotes deep taproot
40 | 4 | Loam | 5 | Excellent growth; balances drainage and nutrients
41 | 4 | Silt Loam | 4 | Good fertility; ensure drainage
42 | 4 | Silt | 3 | Risk of compaction; taproot may struggle
43 | 4 | Sandy Clay Loam | 4 | Acceptable; tolerates poor drainage
44 | 4 | Clay Loam | 3 | Manageable; avoid waterlogging
45 | 4 | Silty Clay Loam | 2 | Heavy soil; risk of root diseases
46 | 4 | Sandy Clay | 2 | Poor aeration; difficult for root penetration
47 | 4 | Silty Clay | 1 | High water retention; risk of root rot
48 | 4 | Clay | 1 | Too compact; prevents taproot establishment
49 | 5 | Sand | 3 | Requires frequent irrigation; low nutrient retention
50 | 5 | Loamy Sand | 3 | Drought stress risk; needs organic matter
51 | 5 | Sandy Loam | 4 | Good drainage; suits sprawling vines
52 | 5 | Loam | 5 | Ideal fertility and moisture balance
53 | 5 | Silt Loam | 5 | Excellent moisture for large fruits
54 | 5 | Silt | 4 | Good water retention; heavy feeder suits it
55 | 5 | Sandy Clay Loam | 4 | Retains heat and water; good
56 | 5 | Clay Loam | 3 | Acceptable if drainage is managed
57 | 5 | Silty Clay Loam | 3 | Risk of fruit rot in wet soil
58 | 5 | Sandy Clay | 2 | Poor workability; compaction risk
59 | 5 | Silty Clay | 2 | High disease risk; poor drainage
60 | 5 | Clay | 1 | Waterlogging kills vines; avoid
61 | 6 | Sand | 4 | Easy harvest; needs fertilizer and water
62 | 6 | Loamy Sand | 4 | Good for root shape; needs organic matter
63 | 6 | Sandy Loam | 5 | Ideal for uniform root development
64 | 6 | Loam | 5 | Excellent texture; retains moisture for swelling
65 | 6 | Silt Loam | 4 | Good; risk of misshapen roots if compacted
66 | 6 | Silt | 3 | Risk of forking roots; manage compaction
67 | 6 | Sandy Clay Loam | 4 | Acceptable; roots may be smaller
68 | 6 | Clay Loam | 3 | Heavy soil; roots struggle to expand
69 | 6 | Silty Clay Loam | 2 | High resistance to root growth; misshapen
70 | 6 | Sandy Clay | 2 | Difficult harvest; forking common
71 | 6 | Silty Clay | 1 | Soil too heavy; restricts bulb formation
72 | 6 | Clay | 1 | Hard soil; roots will not form bulbs
73 | 7 | Sand | 4 | Good drainage; requires nitrogen inputs
74 | 7 | Loamy Sand | 4 | Suitable; drought tolerant crop
75 | 7 | Sandy Loam | 5 | Ideal; deep roots penetrate easily
76 | 7 | Loam | 5 | Excellent balance; fixes nitrogen effectively
77 | 7 | Silt Loam | 4 | Good retention; ensure drainage
78 | 7 | Silt | 3 | Can restrict root depth; acceptable
79 | 7 | Sandy Clay Loam | 4 | Suitable for rainfed conditions
80 | 7 | Clay Loam | 3 | Drainage critical to avoid root rot
81 | 7 | Silty Clay Loam | 2 | Risk of fungal diseases in wet soil
82 | 7 | Sandy Clay | 2 | Hard soil; affects root nodulation
83 | 7 | Silty Clay | 1 | Waterlogging risk; high failure rate
84 | 7 | Clay | 1 | Excessive moisture; root rot risk
85 | 8 | Sand | 3 | Low fertility; needs frequent inputs
86 | 8 | Loamy Sand | 3 | Drains fast; drought stress risk
87 | 8 | Sandy Loam | 4 | Good drainage; warms soil quickly
88 | 8 | Loam | 5 | Ideal for vigorous growth and pod set
89 | 8 | Silt Loam | 5 | Excellent moisture; good for summer crop
90 | 8 | Silt | 4 | Good fertility; watch for crusting
91 | 8 | Sandy Clay Loam | 4 | Retains moisture; acceptable
92 | 8 | Clay Loam | 3 | Manageable; needs drainage
93 | 8 | Silty Clay Loam | 2 | Heavy soil; root rot risk
94 | 8 | Sandy Clay | 2 | Poor aeration; stunts growth
95 | 8 | Silty Clay | 1 | Waterlogging common; avoid
96 | 8 | Clay | 1 | Too compact; poor root development
97 | 9 | Sand | 3 | Requires heavy irrigation; low nutrients
98 | 9 | Loamy Sand | 3 | Water stress limits fruit size
99 | 9 | Sandy Loam | 4 | Good drainage; prefers warm soil
100 | 9 | Loam | 5 | Ideal for vine growth and fruit production
101 | 9 | Silt Loam | 5 | Excellent water retention for fruits
102 | 9 | Silt | 4 | Good nutrients; ensure support for vines
103 | 9 | Sandy Clay Loam | 4 | Acceptable drainage; good yield
104 | 9 | Clay Loam | 3 | Manageable with organic matter
105 | 9 | Silty Clay Loam | 2 | Disease risk increases
106 | 9 | Sandy Clay | 2 | Poor structure; restricts roots
107 | 9 | Silty Clay | 1 | High water retention; root diseases
108 | 9 | Clay | 1 | Waterlogging kills vines
109 | 10 | Sand | 3 | Low water retention; needs irrigation
110 | 10 | Loamy Sand | 3 | Drains too fast; drought risk
111 | 10 | Sandy Loam | 4 | Good for early growth; needs fertility
112 | 10 | Loam | 5 | Ideal for nodulation and pod fill
113 | 10 | Silt Loam | 5 | Excellent moisture; boosts yield
114 | 10 | Silt | 4 | Good; ensure drainage
115 | 10 | Sandy Clay Loam | 4 | Acceptable; tolerates light drought
116 | 10 | Clay Loam | 3 | Heavy soil; drainage needed
117 | 10 | Silty Clay Loam | 2 | Risk of waterlogging; root rot
118 | 10 | Sandy Clay | 2 | Compaction limits roots
119 | 10 | Silty Clay | 1 | Avoid; poor drainage
120 | 10 | Clay | 1 | Waterlogging risk; crop failure
121 | 11 | Sand | 3 | Needs constant water; low fertility
122 | 11 | Loamy Sand | 3 | Drought stress; small fruits
123 | 11 | Sandy Loam | 4 | Good drainage; prefers heat
124 | 11 | Loam | 5 | Ideal for large fruit development
125 | 11 | Silt Loam | 5 | Excellent moisture retention
126 | 11 | Silt | 4 | Good fertility; watch compaction
127 | 11 | Sandy Clay Loam | 4 | Retains heat; good
128 | 11 | Clay Loam | 3 | Acceptable; ensure drainage
129 | 11 | Silty Clay Loam | 2 | Risk of fungal issues
130 | 11 | Sandy Clay | 2 | Poor workability
131 | 11 | Silty Clay | 1 | Waterlogging risk
132 | 11 | Clay | 1 | Soil too heavy; avoid
133 | 12 | Sand | 3 | Low nutrients; needs heavy fertilizer
134 | 12 | Loamy Sand | 3 | Drought stress; stunts growth
135 | 12 | Sandy Loam | 4 | Good drainage; warms well
136 | 12 | Loam | 5 | Ideal for root system and fruit set
137 | 12 | Silt Loam | 5 | Excellent moisture; high yield
138 | 12 | Silt | 4 | Good fertility; ensure drainage
139 | 12 | Sandy Clay Loam | 4 | Retains moisture; acceptable
140 | 12 | Clay Loam | 3 | Manageable; good nutrient supply
141 | 12 | Silty Clay Loam | 2 | Heavy soil; root rot risk
142 | 12 | Sandy Clay | 2 | Poor aeration; yield loss
143 | 12 | Silty Clay | 1 | Waterlogging; disease prone
144 | 12 | Clay | 1 | Compaction kills roots
145 | 13 | Sand | 3 | Drains too fast; heads small
146 | 13 | Loamy Sand | 3 | Needs constant water and nutrients
147 | 13 | Sandy Loam | 4 | Good drainage; early maturity
148 | 13 | Loam | 5 | Ideal for firm head formation
149 | 13 | Silt Loam | 5 | Excellent moisture; large heads
150 | 13 | Silt | 4 | Good; heavy feeder satisfied
151 | 13 | Sandy Clay Loam | 4 | Retains moisture; acceptable
152 | 13 | Clay Loam | 3 | Heavy; manage drainage
153 | 13 | Silty Clay Loam | 2 | Risk of root diseases
154 | 13 | Sandy Clay | 2 | Hard soil; restricts roots
155 | 13 | Silty Clay | 1 | Poor drainage; head rot
156 | 13 | Clay | 1 | Waterlogging; avoid
157 | 14 | Sand | 3 | Drought stress; nutrient leaching
158 | 14 | Loamy Sand | 3 | Needs frequent irrigation
159 | 14 | Sandy Loam | 4 | Good drainage; prevents rot
160 | 14 | Loam | 5 | Ideal texture for root establishment
161 | 14 | Silt Loam | 5 | Excellent moisture; uniform fruit
162 | 14 | Silt | 4 | Good; watch for compaction
163 | 14 | Sandy Clay Loam | 4 | Retains water; acceptable
164 | 14 | Clay Loam | 3 | Heavy; needs drainage
165 | 14 | Silty Clay Loam | 2 | Disease risk increases
166 | 14 | Sandy Clay | 2 | Poor aeration
167 | 14 | Silty Clay | 1 | Waterlogging risk; avoid
168 | 14 | Clay | 1 | Too compact; root issues
169 | 15 | Sand | 4 | Easy harvest; needs fertilizer
170 | 15 | Loamy Sand | 4 | Deep roots; good shape
171 | 15 | Sandy Loam | 5 | Ideal for straight clean roots
172 | 15 | Loam | 5 | Excellent balance; retains moisture
173 | 15 | Silt Loam | 4 | Good; risk of forking if compacted
174 | 15 | Silt | 3 | Forking risk; manage carefully
175 | 15 | Sandy Clay Loam | 3 | Resistance to root growth
176 | 15 | Clay Loam | 2 | Heavy soil; misshapen roots
177 | 15 | Silty Clay Loam | 1 | Roots cannot expand; deform
178 | 15 | Sandy Clay | 1 | Too hard; forking guaranteed
179 | 15 | Silty Clay | 1 | Severe forking; unmarketable
180 | 15 | Clay | 1 | Too compact; no root formation
181 | 16 | Sand | 4 | Deep roots handle drought; low fertility ok
182 | 16 | Loamy Sand | 4 | Good drainage; suitable for arid lands
183 | 16 | Sandy Loam | 5 | Ideal for taproot development
184 | 16 | Loam | 5 | Excellent growth and biomass
185 | 16 | Silt Loam | 4 | Good moisture; acceptable
186 | 16 | Silt | 3 | Compaction risk; taproot struggles
187 | 16 | Sandy Clay Loam | 4 | Tolerates heavy soil
188 | 16 | Clay Loam | 3 | Manageable; deep roots help
189 | 16 | Silty Clay Loam | 2 | Heavy; drainage needed
190 | 16 | Sandy Clay | 2 | Poor workability
191 | 16 | Silty Clay | 1 | Waterlogging kills plant
192 | 16 | Clay | 1 | Root rot risk; avoid
193 | 17 | Sand | 3 | Drains too fast; poor curds
194 | 17 | Loamy Sand | 3 | Needs heavy inputs
195 | 17 | Sandy Loam | 4 | Good drainage; early crop
196 | 17 | Loam | 5 | Ideal for curd development
197 | 17 | Silt Loam | 5 | Excellent moisture; quality curds
198 | 17 | Silt | 4 | Heavy feeder; good fertility
199 | 17 | Sandy Clay Loam | 4 | Acceptable; needs water
200 | 17 | Clay Loam | 3 | Heavy; manage drainage
201 | 17 | Silty Clay Loam | 2 | Disease risk
202 | 17 | Sandy Clay | 2 | Compaction issues
203 | 17 | Silty Clay | 1 | Root rot risk
204 | 17 | Clay | 1 | Waterlogging; avoid
205 | 18 | Sand | 3 | Drought stress; low yield
206 | 18 | Loamy Sand | 3 | Needs frequent water
207 | 18 | Sandy Loam | 4 | Good drainage; warms well
208 | 18 | Loam | 5 | Ideal for vigorous plants
209 | 18 | Silt Loam | 5 | Excellent moisture retention
210 | 18 | Silt | 4 | Good fertility; manageable
211 | 18 | Sandy Clay Loam | 4 | Retains moisture; acceptable
212 | 18 | Clay Loam | 3 | Heavy; needs drainage
213 | 18 | Silty Clay Loam | 2 | Disease risk in wet soil
214 | 18 | Sandy Clay | 2 | Compaction; stunts growth
215 | 18 | Silty Clay | 1 | Waterlogging; root rot
216 | 18 | Clay | 1 | Too heavy; avoid
217 | 19 | Sand | 3 | Needs rich moist soil; drains too fast
218 | 19 | Loamy Sand | 3 | Drought stress; vine dieback
219 | 19 | Sandy Loam | 4 | Good; needs organic matter
220 | 19 | Loam | 5 | Ideal for vigorous vines
221 | 19 | Silt Loam | 5 | Excellent moisture; large fruits
222 | 19 | Silt | 4 | Good fertility; ensure trellis drainage
223 | 19 | Sandy Clay Loam | 3 | Acceptable; manage water
224 | 19 | Clay Loam | 2 | Risk of root rot
225 | 19 | Silty Clay Loam | 1 | Poor drainage; fungal issues
226 | 19 | Sandy Clay | 1 | Too heavy; avoid
227 | 19 | Silty Clay | 1 | Waterlogging; vine death
228 | 19 | Clay | 1 | Not viable
229 | 20 | Sand | 4 | Tolerates poor soil; drought hardy
230 | 20 | Loamy Sand | 4 | Good for arid zones
231 | 20 | Sandy Loam | 5 | Ideal; low input required
232 | 20 | Loam | 5 | Excellent growth; fixes nitrogen
233 | 20 | Silt Loam | 4 | Good; retains moisture
234 | 20 | Silt | 3 | Acceptable; watch drainage
235 | 20 | Sandy Clay Loam | 4 | Suitable for drylands
236 | 20 | Clay Loam | 3 | Manageable; deep roots
237 | 20 | Silty Clay Loam | 2 | Heavy; risk of rot
238 | 20 | Sandy Clay | 2 | Poor workability
239 | 20 | Silty Clay | 1 | Waterlogging; crop failure
240 | 20 | Clay | 1 | Avoid
241 | 21 | Sand | 3 | Needs irrigation; nutrient leaching
242 | 21 | Loamy Sand | 3 | Drought risk; affects boll
243 | 21 | Sandy Loam | 4 | Good drainage; early maturity
244 | 21 | Loam | 5 | Ideal for deep taproot and yield
245 | 21 | Silt Loam | 5 | Excellent water retention
246 | 21 | Silt | 4 | Good fertility; manage drainage
247 | 21 | Sandy Clay Loam | 4 | Retains moisture; heavy soils ok
248 | 21 | Clay Loam | 5 | High fertility; good for cotton
249 | 21 | Silty Clay Loam | 3 | Heavy; harvest delayed
250 | 21 | Sandy Clay | 2 | Workability issues
251 | 21 | Silty Clay | 1 | Poor drainage; avoid
252 | 21 | Clay | 1 | Too wet; boll rot risk
253 | 22 | Sand | 4 | Drought tolerant; low fertility ok
254 | 22 | Loamy Sand | 4 | Good for dryland grazing
255 | 22 | Sandy Loam | 5 | Ideal for beans and fodder
256 | 22 | Loam | 5 | Excellent growth; high yield
257 | 22 | Silt Loam | 4 | Good moisture; acceptable
258 | 22 | Silt | 3 | Watch for compaction
259 | 22 | Sandy Clay Loam | 4 | Suitable for semi-arid
260 | 22 | Clay Loam | 3 | Manageable; ensure drainage
261 | 22 | Silty Clay Loam | 2 | Disease risk
262 | 22 | Sandy Clay | 2 | Compaction issues
263 | 22 | Silty Clay | 1 | Waterlogging; root rot
264 | 22 | Clay | 1 | Not recommended
265 | 23 | Sand | 3 | Needs frequent irrigation
266 | 23 | Loamy Sand | 3 | Drains too fast; bitter fruit
267 | 23 | Sandy Loam | 4 | Good drainage; likes heat
268 | 23 | Loam | 5 | Ideal for rapid growth
269 | 23 | Silt Loam | 5 | Excellent moisture; crisp fruit
270 | 23 | Silt | 4 | Good; heavy feeder
271 | 23 | Sandy Clay Loam | 4 | Acceptable; manage water
272 | 23 | Clay Loam | 3 | Heavy; drainage needed
273 | 23 | Silty Clay Loam | 2 | Fungal disease risk
274 | 23 | Sandy Clay | 2 | Hard soil; poor roots
275 | 23 | Silty Clay | 1 | Waterlogging; vine death
276 | 23 | Clay | 1 | Avoid
277 | 24 | Sand | 3 | Needs moisture; looser soil preferred
278 | 24 | Loamy Sand | 3 | Drought stress; small corm
279 | 24 | Sandy Loam | 4 | Good drainage; easy harvest
280 | 24 | Loam | 5 | Ideal for corm expansion
281 | 24 | Silt Loam | 5 | Excellent moisture; large size
282 | 24 | Silt | 4 | Good fertility; ensure drainage
283 | 24 | Sandy Clay Loam | 3 | Acceptable; harvest harder
284 | 24 | Clay Loam | 2 | Heavy; corm deformity
285 | 24 | Silty Clay Loam | 2 | Risk of rot
286 | 24 | Sandy Clay | 1 | Too hard; harvest impossible
287 | 24 | Silty Clay | 1 | Rot risk; avoid
288 | 24 | Clay | 1 | Not viable
289 | 25 | Sand | 3 | Low fertility; drought stress
290 | 25 | Loamy Sand | 3 | Needs constant water
291 | 25 | Sandy Loam | 4 | Good drainage; early crop
292 | 25 | Loam | 5 | Ideal for pod development
293 | 25 | Silt Loam | 5 | Excellent moisture; tender pods
294 | 25 | Silt | 4 | Good; watch for crusting
295 | 25 | Sandy Clay Loam | 3 | Retains water; acceptable
296 | 25 | Clay Loam | 2 | Heavy; harvest issues
297 | 25 | Silty Clay Loam | 2 | Disease risk
298 | 25 | Sandy Clay | 1 | Compaction; poor emergence
299 | 25 | Silty Clay | 1 | Waterlogging; avoid
300 | 25 | Clay | 1 | Not recommended
301 | 26 | Sand | 4 | Tolerates drought; low fertility ok
302 | 26 | Loamy Sand | 4 | Good drainage; warm soil
303 | 26 | Sandy Loam | 5 | Ideal for root system
304 | 26 | Loam | 5 | Excellent for oil content
305 | 26 | Silt Loam | 4 | Good; ensure drainage
306 | 26 | Silt | 3 | Acceptable; risk of compaction
307 | 26 | Sandy Clay Loam | 4 | Suitable for drylands
308 | 26 | Clay Loam | 3 | Heavy; manage water
309 | 26 | Silty Clay Loam | 2 | Harvest difficulty
310 | 26 | Sandy Clay | 2 | Poor aeration
311 | 26 | Silty Clay | 1 | Waterlogging kills crop
312 | 26 | Clay | 1 | Avoid
313 | 27 | Sand | 4 | Drought hardy; low input
314 | 27 | Loamy Sand | 4 | Good for short season
315 | 27 | Sandy Loam | 5 | Ideal for nodulation
316 | 27 | Loam | 5 | Excellent yield
317 | 27 | Silt Loam | 4 | Good moisture
318 | 27 | Silt | 3 | Manageable
319 | 27 | Sandy Clay Loam | 4 | Suitable
320 | 27 | Clay Loam | 3 | Drainage needed
321 | 27 | Silty Clay Loam | 2 | Disease risk
322 | 27 | Sandy Clay | 2 | Compaction
323 | 27 | Silty Clay | 1 | Waterlogging
324 | 27 | Clay | 1 | Avoid
325 | 28 | Sand | 4 | Easy harvest; needs fertilizer
326 | 28 | Loamy Sand | 4 | Good for pegging; loose soil
327 | 28 | Sandy Loam | 5 | Ideal for pod development
328 | 28 | Loam | 5 | Excellent balance
329 | 28 | Silt Loam | 4 | Good; compaction hurts pegs
330 | 28 | Silt | 3 | Harvest difficult; pods stain
331 | 28 | Sandy Clay Loam | 3 | Acceptable; hard harvest
332 | 28 | Clay Loam | 2 | Poor drainage; pod rot
333 | 28 | Silty Clay Loam | 1 | Pegs cannot penetrate; rot
334 | 28 | Sandy Clay | 1 | Too hard; harvest impossible
335 | 28 | Silty Clay | 1 | Avoid
336 | 28 | Clay | 1 | Not viable
337 | 29 | Sand | 4 | Very drought tolerant; hardy
338 | 29 | Loamy Sand | 4 | Good for marginal lands
339 | 29 | Sandy Loam | 5 | Ideal for low rainfall areas
340 | 29 | Loam | 5 | Excellent hardy crop
341 | 29 | Silt Loam | 4 | Good; acceptable
342 | 29 | Silt | 3 | Manageable
343 | 29 | Sandy Clay Loam | 4 | Suitable
344 | 29 | Clay Loam | 3 | Tolerates heavy soil
345 | 29 | Silty Clay Loam | 2 | Drainage needed
346 | 29 | Sandy Clay | 2 | Hard soil
347 | 29 | Silty Clay | 1 | Waterlogging risk
348 | 29 | Clay | 1 | Avoid
349 | 30 | Sand | 4 | Needs irrigation; good drainage
350 | 30 | Loamy Sand | 4 | Good for roots; water needed
351 | 30 | Sandy Loam | 5 | Ideal for sweet fruit
352 | 30 | Loam | 5 | Excellent moisture; high yield
353 | 30 | Silt Loam | 5 | Perfect for melons
354 | 30 | Silt | 4 | Good; ensure drainage
355 | 30 | Sandy Clay Loam | 4 | Acceptable
356 | 30 | Clay Loam | 3 | Manageable; avoid wet feet
357 | 30 | Silty Clay Loam | 2 | Disease risk
358 | 30 | Sandy Clay | 2 | Poor aeration
359 | 30 | Silty Clay | 1 | Waterlogging; fruit rot
360 | 30 | Clay | 1 | Avoid
361 | 31 | Sand | 4 | Easy harvest; needs water/fert
362 | 31 | Loamy Sand | 4 | Good bulb shape
363 | 31 | Sandy Loam | 5 | Ideal for bulb expansion
364 | 31 | Loam | 5 | Excellent quality
365 | 31 | Silt Loam | 4 | Good; risk of staining
366 | 31 | Silt | 3 | Heavy; difficult harvest
367 | 31 | Sandy Clay Loam | 3 | Harder harvest
368 | 31 | Clay Loam | 2 | Bulbs deform; hard harvest
369 | 31 | Silty Clay Loam | 1 | Poor drainage; rot
370 | 31 | Sandy Clay | 1 | Too hard; misshapen
371 | 31 | Silty Clay | 1 | Avoid
372 | 31 | Clay | 1 | Not viable
373 | 32 | Sand | 4 | Drought tolerant; good for sand
374 | 32 | Loamy Sand | 4 | Suitable for marginal land
375 | 32 | Sandy Loam | 5 | Ideal for low input
376 | 32 | Loam | 5 | Excellent yield
377 | 32 | Silt Loam | 4 | Good moisture
378 | 32 | Silt | 3 | Acceptable
379 | 32 | Sandy Clay Loam | 4 | Suitable
380 | 32 | Clay Loam | 3 | Drainage needed
381 | 32 | Silty Clay Loam | 2 | Heavy
382 | 32 | Sandy Clay | 2 | Hard soil
383 | 32 | Silty Clay | 1 | Waterlogging
384 | 32 | Clay | 1 | Avoid
385 | 33 | Sand | 5 | Highly adapted to sand; drought hardy
386 | 33 | Loamy Sand | 5 | Ideal for arid zones
387 | 33 | Sandy Loam | 5 | Excellent for rainfed
388 | 33 | Loam | 4 | Good; fertile
389 | 33 | Silt Loam | 4 | Good
390 | 33 | Silt | 3 | Acceptable
391 | 33 | Sandy Clay Loam | 4 | Suitable
392 | 33 | Clay Loam | 3 | Heavy soil ok
393 | 33 | Silty Clay Loam | 2 | Risk of rot
394 | 33 | Sandy Clay | 2 | Hard
395 | 33 | Silty Clay | 1 | Waterlogging
396 | 33 | Clay | 1 | Avoid
397 | 34 | Sand | 3 | Drought stress; low yield
398 | 34 | Loamy Sand | 3 | Needs water
399 | 34 | Sandy Loam | 4 | Good drainage; early crop
400 | 34 | Loam | 5 | Ideal for cool season
401 | 34 | Silt Loam | 5 | Excellent moisture
402 | 34 | Silt | 4 | Good; heavy feeder
403 | 34 | Sandy Clay Loam | 4 | Acceptable
404 | 34 | Clay Loam | 3 | Manageable; drainage needed
405 | 34 | Silty Clay Loam | 2 | Root rot risk
406 | 34 | Sandy Clay | 2 | Compaction
407 | 34 | Silty Clay | 1 | Wet soil; rot
408 | 34 | Clay | 1 | Avoid
409 | 35 | Sand | 3 | Needs water; low fertility
410 | 35 | Loamy Sand | 3 | Drought stress
411 | 35 | Sandy Loam | 4 | Good drainage
412 | 35 | Loam | 5 | Ideal for large fruits
413 | 35 | Silt Loam | 5 | Excellent moisture
414 | 35 | Silt | 4 | Good
415 | 35 | Sandy Clay Loam | 4 | Acceptable
416 | 35 | Clay Loam | 3 | Manageable
417 | 35 | Silty Clay Loam | 2 | Disease risk
418 | 35 | Sandy Clay | 2 | Hard soil
419 | 35 | Silty Clay | 1 | Waterlogging
420 | 35 | Clay | 1 | Avoid
421 | 36 | Sand | 4 | Easy harvest; needs fert
422 | 36 | Loamy Sand | 4 | Good shape
423 | 36 | Sandy Loam | 5 | Ideal for roots
424 | 36 | Loam | 5 | Excellent
425 | 36 | Silt Loam | 4 | Good; watch compaction
426 | 36 | Silt | 3 | Forking risk
427 | 36 | Sandy Clay Loam | 3 | Harder soil
428 | 36 | Clay Loam | 2 | Misshapen roots
429 | 36 | Silty Clay Loam | 1 | Deformed roots
430 | 36 | Sandy Clay | 1 | Too hard
431 | 36 | Silty Clay | 1 | Avoid
432 | 36 | Clay | 1 | Not viable
433 | 37 | Sand | 4 | Drought tolerant; sandy ok
434 | 37 | Loamy Sand | 4 | Suitable
435 | 37 | Sandy Loam | 5 | Ideal for rainfed
436 | 37 | Loam | 5 | Excellent
437 | 37 | Silt Loam | 4 | Good
438 | 37 | Silt | 3 | Acceptable
439 | 37 | Sandy Clay Loam | 4 | Suitable
440 | 37 | Clay Loam | 3 | Heavy soil
441 | 37 | Silty Clay Loam | 2 | Wet soil
442 | 37 | Sandy Clay | 2 | Hard
443 | 37 | Silty Clay | 1 | Waterlogging
444 | 37 | Clay | 1 | Avoid
445 | 38 | Sand | 4 | Drought hardy; deep roots
446 | 38 | Loamy Sand | 4 | Good for semi-arid
447 | 38 | Sandy Loam | 5 | Ideal for long season
448 | 38 | Loam | 5 | Excellent yield
449 | 38 | Silt Loam | 4 | Good moisture
450 | 38 | Silt | 3 | Acceptable
451 | 38 | Sandy Clay Loam | 4 | Suitable
452 | 38 | Clay Loam | 3 | Manageable
453 | 38 | Silty Clay Loam | 2 | Heavy
454 | 38 | Sandy Clay | 2 | Compaction
455 | 38 | Silty Clay | 1 | Waterlogging
456 | 38 | Clay | 1 | Avoid
457 | 39 | Sand | 3 | Needs water
458 | 39 | Loamy Sand | 3 | Drought risk
459 | 39 | Sandy Loam | 4 | Good drainage
460 | 39 | Loam | 5 | Ideal
461 | 39 | Silt Loam | 5 | Excellent
462 | 39 | Silt | 4 | Good
463 | 39 | Sandy Clay Loam | 4 | Acceptable
464 | 39 | Clay Loam | 3 | Manageable
465 | 39 | Silty Clay Loam | 2 | Disease risk
466 | 39 | Sandy Clay | 2 | Hard
467 | 39 | Silty Clay | 1 | Rot risk
468 | 39 | Clay | 1 | Avoid
469 | 40 | Sand | 4 | Drought tolerant
470 | 40 | Loamy Sand | 4 | Suitable
471 | 40 | Sandy Loam | 5 | Ideal
472 | 40 | Loam | 5 | Excellent
473 | 40 | Silt Loam | 4 | Good
474 | 40 | Silt | 3 | Acceptable
475 | 40 | Sandy Clay Loam | 4 | Suitable
476 | 40 | Clay Loam | 3 | Heavy
477 | 40 | Silty Clay Loam | 2 | Wet
478 | 40 | Sandy Clay | 2 | Hard
479 | 40 | Silty Clay | 1 | Waterlogging
480 | 40 | Clay | 1 | Avoid
481 | 41 | Sand | 4 | Easy harvest; needs fert
482 | 41 | Loamy Sand | 4 | Good shape
483 | 41 | Sandy Loam | 5 | Ideal
484 | 41 | Loam | 5 | Excellent
485 | 41 | Silt Loam | 4 | Good
486 | 41 | Silt | 3 | Compaction risk
487 | 41 | Sandy Clay Loam | 3 | Harder
488 | 41 | Clay Loam | 2 | Deformity
489 | 41 | Silty Clay Loam | 1 | Rot
490 | 41 | Sandy Clay | 1 | Too hard
491 | 41 | Silty Clay | 1 | Avoid
492 | 41 | Clay | 1 | Not viable
493 | 42 | Sand | 3 | Needs water
494 | 42 | Loamy Sand | 3 | Drought
495 | 42 | Sandy Loam | 4 | Good
496 | 42 | Loam | 5 | Ideal
497 | 42 | Silt Loam | 5 | Excellent
498 | 42 | Silt | 4 | Good
499 | 42 | Sandy Clay Loam | 4 | Acceptable
500 | 42 | Clay Loam | 3 | Manageable
501 | 42 | Silty Clay Loam | 2 | Disease
502 | 42 | Sandy Clay | 2 | Hard
503 | 42 | Silty Clay | 1 | Rot
504 | 42 | Clay | 1 | Avoid
505 | 43 | Sand | 4 | Drought tolerant; deep roots
506 | 43 | Loamy Sand | 4 | Suitable for dryland
507 | 43 | Sandy Loam | 5 | Ideal for grain
508 | 43 | Loam | 5 | Excellent yield
509 | 43 | Silt Loam | 4 | Good moisture
510 | 43 | Silt | 3 | Acceptable
511 | 43 | Sandy Clay Loam | 4 | Suitable
512 | 43 | Clay Loam | 4 | Good for sorghum
513 | 43 | Silty Clay Loam | 3 | Heavy; manage drainage
514 | 43 | Sandy Clay | 2 | Hard soil
515 | 43 | Silty Clay | 1 | Waterlogging
516 | 43 | Clay | 1 | Avoid
517 | 44 | Sand | 3 | Low fertility; drought
518 | 44 | Loamy Sand | 3 | Water stress
519 | 44 | Sandy Loam | 4 | Good drainage
520 | 44 | Loam | 5 | Ideal for beans
521 | 44 | Silt Loam | 5 | Excellent
522 | 44 | Silt | 4 | Good
523 | 44 | Sandy Clay Loam | 4 | Suitable
524 | 44 | Clay Loam | 3 | Heavy; manage drainage
525 | 44 | Silty Clay Loam | 2 | Root rot risk
526 | 44 | Sandy Clay | 2 | Compaction
527 | 44 | Silty Clay | 1 | Waterlogging
528 | 44 | Clay | 1 | Avoid
529 | 45 | Sand | 4 | Needs water; easy harvest
530 | 45 | Loamy Sand | 4 | Good for root
531 | 45 | Sandy Loam | 5 | Ideal for sugar content
532 | 45 | Loam | 5 | Excellent yield
533 | 45 | Silt Loam | 4 | Good moisture
534 | 45 | Silt | 3 | Compaction risk
535 | 45 | Sandy Clay Loam | 4 | Suitable
536 | 45 | Clay Loam | 3 | Heavy; harvest harder
537 | 45 | Silty Clay Loam | 2 | Deformity risk
538 | 45 | Sandy Clay | 2 | Hard harvest
539 | 45 | Silty Clay | 1 | Rot risk
540 | 45 | Clay | 1 | Avoid
541 | 46 | Sand | 3 | Needs heavy irrigation
542 | 46 | Loamy Sand | 3 | Water stress
543 | 46 | Sandy Loam | 4 | Good drainage
544 | 46 | Loam | 5 | Ideal for biomass
545 | 46 | Silt Loam | 5 | Excellent moisture
546 | 46 | Silt | 4 | Good retention
547 | 46 | Sandy Clay Loam | 4 | Suitable
548 | 46 | Clay Loam | 5 | High fertility; good retention
549 | 46 | Silty Clay Loam | 3 | Heavy; manage water
550 | 46 | Sandy Clay | 2 | Hard to till
551 | 46 | Silty Clay | 1 | Poor drainage
552 | 46 | Clay | 1 | Waterlogging; avoid
553 | 47 | Sand | 4 | Drought tolerant; deep roots
554 | 47 | Loamy Sand | 4 | Suitable
555 | 47 | Sandy Loam | 5 | Ideal
556 | 47 | Loam | 5 | Excellent
557 | 47 | Silt Loam | 4 | Good
558 | 47 | Silt | 3 | Acceptable
559 | 47 | Sandy Clay Loam | 4 | Suitable
560 | 47 | Clay Loam | 3 | Heavy; acceptable
561 | 47 | Silty Clay Loam | 2 | Drainage needed
562 | 47 | Sandy Clay | 2 | Compaction
563 | 47 | Silty Clay | 1 | Waterlogging
564 | 47 | Clay | 1 | Avoid
565 | 48 | Sand | 4 | Easy harvest; needs fert
566 | 48 | Loamy Sand | 4 | Good root shape
567 | 48 | Sandy Loam | 5 | Ideal for tubers
568 | 48 | Loam | 5 | Excellent yield
569 | 48 | Silt Loam | 4 | Good moisture
570 | 48 | Silt | 3 | Compaction; deformed tubers
571 | 48 | Sandy Clay Loam | 3 | Harder harvest
572 | 48 | Clay Loam | 2 | Heavy; tuber deformity
573 | 48 | Silty Clay Loam | 1 | Rot risk
574 | 48 | Sandy Clay | 1 | Too hard
575 | 48 | Silty Clay | 1 | Avoid
576 | 48 | Clay | 1 | Not viable
577 | 49 | Sand | 4 | Drought tolerant
578 | 49 | Loamy Sand | 4 | Suitable
579 | 49 | Sandy Loam | 5 | Ideal
580 | 49 | Loam | 5 | Excellent
581 | 49 | Silt Loam | 4 | Good
582 | 49 | Silt | 3 | Acceptable
583 | 49 | Sandy Clay Loam | 4 | Suitable
584 | 49 | Clay Loam | 3 | Manageable
585 | 49 | Silty Clay Loam | 2 | Disease risk
586 | 49 | Sandy Clay | 2 | Hard
587 | 49 | Silty Clay | 1 | Waterlogging
588 | 49 | Clay | 1 | Avoid
589 | 50 | Sand | 3 | Low fertility; water stress
590 | 50 | Loamy Sand | 3 | Needs frequent water
591 | 50 | Sandy Loam | 4 | Good drainage; early
592 | 50 | Loam | 5 | Ideal for roots
593 | 50 | Silt Loam | 5 | Excellent moisture
594 | 50 | Silt | 4 | Good; heavy feeder
595 | 50 | Sandy Clay Loam | 4 | Acceptable
596 | 50 | Clay Loam | 3 | Heavy; manage water
597 | 50 | Silty Clay Loam | 2 | Fungal disease risk
598 | 50 | Sandy Clay | 2 | Compaction
599 | 50 | Silty Clay | 1 | Rot risk
600 | 50 | Clay | 1 | Avoid
601 | 51 | Sand | 4 | Hardy; drought tolerant
602 | 51 | Loamy Sand | 4 | Suitable
603 | 51 | Sandy Loam | 5 | Ideal
604 | 51 | Loam | 5 | Excellent
605 | 51 | Silt Loam | 4 | Good
606 | 51 | Silt | 3 | Acceptable
607 | 51 | Sandy Clay Loam | 4 | Suitable
608 | 51 | Clay Loam | 3 | Heavy
609 | 51 | Silty Clay Loam | 2 | Wet
610 | 51 | Sandy Clay | 2 | Hard
611 | 51 | Silty Clay | 1 | Waterlogging
612 | 51 | Clay | 1 | Avoid
613 | 52 | Sand | 4 | Needs water; sweet fruit
614 | 52 | Loamy Sand | 4 | Good drainage
615 | 52 | Sandy Loam | 5 | Ideal for melons
616 | 52 | Loam | 5 | Excellent
617 | 52 | Silt Loam | 4 | Good moisture
618 | 52 | Silt | 3 | Manageable
619 | 52 | Sandy Clay Loam | 4 | Suitable
620 | 52 | Clay Loam | 3 | Heavy; manage drainage
621 | 52 | Silty Clay Loam | 2 | Disease risk
622 | 52 | Sandy Clay | 2 | Hard
623 | 52 | Silty Clay | 1 | Rot
624 | 52 | Clay | 1 | Avoid"""

# 3. Parse the string and build the objects
soil_objects = []

print("Parsing data...")
for line in raw_data.strip().split('\n'):
    # Split by ' | ' and strip whitespace
    parts = [part.strip() for part in line.split(' | ')]

    # parts[0] is id (ignored, DB handles this)
    crop_id = int(parts[1])
    texture_name = parts[2]
    suitability_rank = int(parts[3])
    note = parts[4]

    # Append as an unsaved Django model instance
    soil_objects.append(
        CropSoilTexture(
            crop_id=crop_id,
            texture_name=texture_name,
            suitability_rank=suitability_rank,
            note=note
        )
    )

# 4. Insert into the database using bulk_create (very fast)
print(f"Inserting {len(soil_objects)} records into the database...")
try:
    CropSoilTexture.objects.bulk_create(soil_objects, batch_size=100)
    print("Success! All records have been inserted.")
except Exception as e:
    print(f"An error occurred: {e}")
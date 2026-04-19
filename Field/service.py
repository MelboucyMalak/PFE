import math

class FieldAnalyzerService:
    @staticmethod
    def calculate_diagonal(polygon_coords):
        """
        As seen in diagram: +calculate_diagonal(polygon) Line
        Finds the distance between the two furthest points.
        """
        if not polygon_coords or len(polygon_coords) < 2:
            return 0
        # Simple max distance calculation between points
        max_dist = 0
        for i, p1 in enumerate(polygon_coords):
            for p2 in polygon_coords[i+1:]:
                dist = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
                if dist > max_dist:
                    max_dist = dist
        return max_dist

    @staticmethod
    def generate_sampling_points(coords, diagonal, step=10):
        """
        Generates actual coordinate pairs [lat, lon] for soil sampling.
        """
        if not coords or len(coords) < 3:
            return []

        # Get the boundaries of the polygon
        lats = [c[0] for c in coords]
        lons = [c[1] for c in coords]
        min_lat, max_lat = min(lats), max(lats)
        min_lon, max_lon = min(lons), max(lons)

        # Calculate a simple 5-point distribution (Center + 4 Quadrants)
        center_lat = (min_lat + max_lat) / 2
        center_lon = (min_lon + max_lon) / 2

        lat_dist = (max_lat - min_lat) * 0.25
        lon_dist = (max_lon - min_lon) * 0.25

        sampling_points = [
            [round(center_lat, 6), round(center_lon, 6)],  # Center
            [round(min_lat + lat_dist, 6), round(min_lon + lon_dist, 6)],  # Bottom Left
            [round(max_lat - lat_dist, 6), round(min_lon + lon_dist, 6)],  # Top Left
            [round(min_lat + lat_dist, 6), round(max_lon - lon_dist, 6)],  # Bottom Right
            [round(max_lat - lat_dist, 6), round(max_lon - lon_dist, 6)],  # Top Right
        ]

        return sampling_points

    @staticmethod
    def calculate_homogeneity(texture_list):
        """
        As seen in diagram: +calculate_homogeneity(texture_list) Float
        Logic: If one texture dominates, homogeneity is high.
        """
        if not texture_list:
            return 0.0
        # Example logic: (Percentage of dominant texture / 100)
        max_coverage = max([t.coverage_percent for t in texture_list])
        return max_coverage / 100.0
class NutrientCalculatorService:
    @staticmethod
    def convert_ppm_to_kg_ha(ppm, depth, density=1.3):
        """+convert_ppm_to_kg_ha(ppm, depth, density) Float"""
        # depth is usually in cm, density in g/cm3
        return ppm * (depth / 10) * density * 10

    @staticmethod
    def get_mineralization_factor(koppen):
        """+get_mineralization_factor(koppen) Float"""
        # Mapping Koppen classes to factors
        factors = {"Af": 0.05, "Am": 0.04, "Aw": 0.03}
        return factors.get(koppen, 0.02)

    @staticmethod
    def calculate_percentage(total_n, p_extr, k_extr, depth):
        """+calculate_percentage(total_n, p_extr, k_extr, depth) Dict"""
        # Logic to return distribution percentages
        return {"N": total_n * 0.1, "P": p_extr * 0.2, "K": k_extr * 0.2}

    @staticmethod
    def calculate_deficit(available, needed):
        """+calculate_deficit(available, needed) Dict"""
        return {
            "n_deficit": max(0, needed.get('n', 0) - available.get('n', 0)),
            "p_deficit": max(0, needed.get('p', 0) - available.get('p', 0)),
            "k_deficit": max(0, needed.get('k', 0) - available.get('k', 0)),
        }
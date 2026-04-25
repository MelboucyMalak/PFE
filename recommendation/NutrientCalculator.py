



def convert_ppm_to_kg_ha(ppm, depth=20, density=1.3):
    return ppm * depth * density * 0.1

def get_mineralization_factor(koppen):
    factors = {"Af": 0.05, "Am": 0.04, "Aw": 0.03}
    return factors.get(koppen, 0.02)


def calculate_percentage(total_n, p_extr, k_extr, depth):
    return {"N": total_n * 0.1, "P": p_extr * 0.2, "K": k_extr * 0.2}

def calculate_deficit(available, needed):
    return {
        "n_deficit": max(0, needed.get('n', 0) - available.get('n', 0)),
        "p_deficit": max(0, needed.get('p', 0) - available.get('p', 0)),
        "k_deficit": max(0, needed.get('k', 0) - available.get('k', 0)),
    }


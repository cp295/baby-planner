# CDC 2024 Childhood Immunization Schedule
# age_weeks = approximate weeks from birth for timeline ordering
IMMUNIZATIONS = [
    # Birth
    {"vaccine_name": "Hepatitis B (HepB)", "age_label": "Birth", "age_weeks": 0, "dose_number": 1, "doses": 3,
     "description": "First dose at birth, protects against Hepatitis B virus infection."},

    # 1 month
    {"vaccine_name": "Hepatitis B (HepB)", "age_label": "1–2 months", "age_weeks": 4, "dose_number": 2, "doses": 3,
     "description": "Second dose of Hepatitis B series."},

    # 2 months
    {"vaccine_name": "DTaP", "age_label": "2 months", "age_weeks": 8, "dose_number": 1, "doses": 5,
     "description": "Protects against Diphtheria, Tetanus, and Pertussis (whooping cough)."},
    {"vaccine_name": "Hib", "age_label": "2 months", "age_weeks": 8, "dose_number": 1, "doses": 4,
     "description": "Haemophilus influenzae type b — prevents meningitis and other serious infections."},
    {"vaccine_name": "IPV (Polio)", "age_label": "2 months", "age_weeks": 8, "dose_number": 1, "doses": 4,
     "description": "Inactivated Poliovirus vaccine."},
    {"vaccine_name": "PCV15/PCV20", "age_label": "2 months", "age_weeks": 8, "dose_number": 1, "doses": 4,
     "description": "Pneumococcal conjugate vaccine — prevents pneumonia, meningitis."},
    {"vaccine_name": "RV (Rotavirus)", "age_label": "2 months", "age_weeks": 8, "dose_number": 1, "doses": 3,
     "description": "Oral vaccine protecting against rotavirus gastroenteritis."},

    # 4 months
    {"vaccine_name": "DTaP", "age_label": "4 months", "age_weeks": 16, "dose_number": 2, "doses": 5,
     "description": "Second dose of DTaP series."},
    {"vaccine_name": "Hib", "age_label": "4 months", "age_weeks": 16, "dose_number": 2, "doses": 4,
     "description": "Second dose of Hib series."},
    {"vaccine_name": "IPV (Polio)", "age_label": "4 months", "age_weeks": 16, "dose_number": 2, "doses": 4,
     "description": "Second dose of IPV series."},
    {"vaccine_name": "PCV15/PCV20", "age_label": "4 months", "age_weeks": 16, "dose_number": 2, "doses": 4,
     "description": "Second dose of pneumococcal series."},
    {"vaccine_name": "RV (Rotavirus)", "age_label": "4 months", "age_weeks": 16, "dose_number": 2, "doses": 3,
     "description": "Second dose of rotavirus series."},

    # 6 months
    {"vaccine_name": "DTaP", "age_label": "6 months", "age_weeks": 26, "dose_number": 3, "doses": 5,
     "description": "Third dose of DTaP series."},
    {"vaccine_name": "Hepatitis B (HepB)", "age_label": "6–18 months", "age_weeks": 26, "dose_number": 3, "doses": 3,
     "description": "Third and final dose of Hepatitis B series."},
    {"vaccine_name": "Hib", "age_label": "6 months", "age_weeks": 26, "dose_number": 3, "doses": 4,
     "description": "Third dose of Hib series."},
    {"vaccine_name": "IPV (Polio)", "age_label": "6–18 months", "age_weeks": 26, "dose_number": 3, "doses": 4,
     "description": "Third dose of IPV series."},
    {"vaccine_name": "PCV15/PCV20", "age_label": "6 months", "age_weeks": 26, "dose_number": 3, "doses": 4,
     "description": "Third dose of pneumococcal series."},
    {"vaccine_name": "RV (Rotavirus)", "age_label": "6 months", "age_weeks": 26, "dose_number": 3, "doses": 3,
     "description": "Third dose of rotavirus series."},
    {"vaccine_name": "Influenza (Flu)", "age_label": "6 months (annually)", "age_weeks": 26, "dose_number": 1, "doses": 1,
     "description": "Annual flu vaccine — first year requires 2 doses given 4 weeks apart."},

    # 12 months
    {"vaccine_name": "MMR", "age_label": "12–15 months", "age_weeks": 52, "dose_number": 1, "doses": 2,
     "description": "Measles, Mumps, and Rubella vaccine."},
    {"vaccine_name": "Varicella (Chickenpox)", "age_label": "12–15 months", "age_weeks": 52, "dose_number": 1, "doses": 2,
     "description": "Varicella vaccine prevents chickenpox."},
    {"vaccine_name": "Hib", "age_label": "12–15 months", "age_weeks": 52, "dose_number": 4, "doses": 4,
     "description": "Final dose of Hib series."},
    {"vaccine_name": "PCV15/PCV20", "age_label": "12–15 months", "age_weeks": 52, "dose_number": 4, "doses": 4,
     "description": "Final dose of pneumococcal series."},
    {"vaccine_name": "Hepatitis A (HepA)", "age_label": "12–23 months", "age_weeks": 52, "dose_number": 1, "doses": 2,
     "description": "First dose of Hepatitis A series — given 6–18 months apart."},

    # 15–18 months
    {"vaccine_name": "DTaP", "age_label": "15–18 months", "age_weeks": 65, "dose_number": 4, "doses": 5,
     "description": "Fourth dose of DTaP series."},

    # 18–23 months
    {"vaccine_name": "Hepatitis A (HepA)", "age_label": "18–23 months", "age_weeks": 78, "dose_number": 2, "doses": 2,
     "description": "Second and final dose of Hepatitis A series."},

    # 4–6 years
    {"vaccine_name": "DTaP", "age_label": "4–6 years", "age_weeks": 208, "dose_number": 5, "doses": 5,
     "description": "Fifth and final dose of DTaP series (booster before school)."},
    {"vaccine_name": "IPV (Polio)", "age_label": "4–6 years", "age_weeks": 208, "dose_number": 4, "doses": 4,
     "description": "Fourth and final dose of IPV series."},
    {"vaccine_name": "MMR", "age_label": "4–6 years", "age_weeks": 208, "dose_number": 2, "doses": 2,
     "description": "Second dose of MMR — required for school entry in Colorado."},
    {"vaccine_name": "Varicella (Chickenpox)", "age_label": "4–6 years", "age_weeks": 208, "dose_number": 2, "doses": 2,
     "description": "Second dose of varicella vaccine."},

    # 11–12 years
    {"vaccine_name": "Tdap", "age_label": "11–12 years", "age_weeks": 572, "dose_number": 1, "doses": 1,
     "description": "Tetanus, Diphtheria, and Pertussis booster for preteens."},
    {"vaccine_name": "HPV", "age_label": "11–12 years", "age_weeks": 572, "dose_number": 1, "doses": 2,
     "description": "Human Papillomavirus vaccine — 2-dose series given 6–12 months apart. Highly effective cancer prevention."},
    {"vaccine_name": "MenACWY (Meningococcal)", "age_label": "11–12 years", "age_weeks": 572, "dose_number": 1, "doses": 2,
     "description": "Meningococcal conjugate vaccine — protects against bacterial meningitis."},

    # 16 years
    {"vaccine_name": "MenACWY (Meningococcal)", "age_label": "16 years (booster)", "age_weeks": 832, "dose_number": 2, "doses": 2,
     "description": "Booster dose of meningococcal vaccine before college age."},
    {"vaccine_name": "MenB", "age_label": "16–18 years", "age_weeks": 832, "dose_number": 1, "doses": 2,
     "description": "Meningococcal B vaccine — especially recommended before college/dorms."},
]

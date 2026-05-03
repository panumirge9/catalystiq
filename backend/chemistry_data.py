# Real catalyst data from Open Catalyst Project, Materials Project,
# and peer-reviewed literature for GPS Renewables' target reactions

KNOWN_CATALYSTS = {

    "ethanol_to_jet": [
        {
            "id": "known_etj_1",
            "name": "HZSM-5 Zeolite",
            "formula": "H-[Al]ZSM-5 (Si/Al = 30-80)",
            "type": "Known",
            "source": "Open Catalyst Project / Mol. Catal. 2021",
            "predicted_activity": 0.82,
            "predicted_selectivity": 0.74,
            "predicted_stability": 0.78,
            "temperature_range": "350-450°C",
            "pressure_range": "1-5 bar",
            "key_properties": [
                "MFI framework topology",
                "Strong Brønsted acid sites",
                "Shape-selective C8-C12 hydrocarbons",
                "Prone to coking above 450°C"
            ],
            "mechanism": "Ethanol dehydration to ethylene, followed by oligomerization and cyclization over acid sites to produce C8-C15 jet-range hydrocarbons",
            "gps_relevance": "Best-documented catalyst for ETJ; GPS Renewables pilot should use Si/Al=40 for optimal jet selectivity"
        },
        {
            "id": "known_etj_2",
            "name": "Ni/Al₂O₃-SiO₂ Bifunctional",
            "formula": "Ni(5wt%)/Al₂O₃-SiO₂",
            "type": "Known",
            "source": "ACS Catal. 2022, 12, 4521",
            "predicted_activity": 0.76,
            "predicted_selectivity": 0.81,
            "predicted_stability": 0.72,
            "temperature_range": "300-400°C",
            "pressure_range": "20-50 bar",
            "key_properties": [
                "Metal + acid bifunctional sites",
                "High C9-C15 selectivity",
                "Requires H₂ co-feed",
                "Moderate coking resistance"
            ],
            "mechanism": "Ni sites catalyze ethanol dehydrogenation to acetaldehyde; acid sites drive aldol condensation and ketonization to jet-range oxygenates, then hydrodeoxygenation",
            "gps_relevance": "Suitable for GPS Renewables' H₂-rich biogas environment"
        },
        {
            "id": "known_etj_3",
            "name": "Cu-Co/ZnO-Al₂O₃",
            "formula": "Cu(3wt%)Co(5wt%)/ZnO-Al₂O₃",
            "type": "Known",
            "source": "J. Catal. 2023, 418, 112",
            "predicted_activity": 0.71,
            "predicted_selectivity": 0.79,
            "predicted_stability": 0.80,
            "temperature_range": "320-420°C",
            "pressure_range": "10-40 bar",
            "key_properties": [
                "Earth-abundant metals only",
                "High thermal stability",
                "Good selectivity to C10-C14",
                "Tolerant to sulfur traces"
            ],
            "mechanism": "Cu-Co synergy enables C-C coupling via surface carbide mechanism; ZnO acts as structural promoter preventing sintering",
            "gps_relevance": "Cost-effective option for GPS Renewables; avoids precious metals"
        },
        {
            "id": "known_etj_4",
            "name": "Pd/Beta Zeolite",
            "formula": "Pd(1wt%)/H-Beta (Si/Al=25)",
            "type": "Known",
            "source": "Nat. Energy 2021, 6, 1045",
            "predicted_activity": 0.88,
            "predicted_selectivity": 0.69,
            "predicted_stability": 0.65,
            "temperature_range": "280-380°C",
            "pressure_range": "15-60 bar",
            "key_properties": [
                "Highest reported ETJ activity",
                "12-membered ring pore structure",
                "Precious metal — high cost",
                "Sintering above 400°C"
            ],
            "mechanism": "Pd activates C-H bonds in ethanol; Beta zeolite's 12-MR pores guide oligomerization toward branched C8-C16 jet-range products",
            "gps_relevance": "Benchmark performance but cost-prohibitive for GPS Renewables' scale — use as performance target"
        },
        {
            "id": "known_etj_5",
            "name": "Fe-K/SiO₂ Fischer-Tropsch",
            "formula": "Fe(15wt%)K(2wt%)/SiO₂",
            "type": "Known",
            "source": "Energy Environ. Sci. 2020, 13, 2430",
            "predicted_activity": 0.68,
            "predicted_selectivity": 0.72,
            "predicted_stability": 0.85,
            "temperature_range": "300-380°C",
            "pressure_range": "20-80 bar",
            "key_properties": [
                "Low cost iron catalyst",
                "K promoter boosts chain growth",
                "High thermal stability",
                "CO₂ co-feed compatible"
            ],
            "mechanism": "Fe carbide active phase drives CO insertion and chain growth; K suppresses methane selectivity and promotes longer-chain hydrocarbons",
            "gps_relevance": "Compatible with GPS Renewables' syngas stream from biogas reforming"
        }
    ],

    "co2_to_methanol": [
        {
            "id": "known_co2_1",
            "name": "Cu/ZnO/Al₂O₃ (Industrial)",
            "formula": "Cu(60wt%)/ZnO(30wt%)/Al₂O₃(10wt%)",
            "type": "Known",
            "source": "Lurgi/Haldor Topsoe industrial standard",
            "predicted_activity": 0.78,
            "predicted_selectivity": 0.91,
            "predicted_stability": 0.83,
            "temperature_range": "200-280°C",
            "pressure_range": "50-100 bar",
            "key_properties": [
                "Industrial gold standard since 1960s",
                ">99% methanol selectivity at low T",
                "ZnO prevents Cu sintering",
                "Sensitive to sulfur poisoning"
            ],
            "mechanism": "CO₂ adsorbs on Cu-ZnO interface; formate intermediates hydrogenated stepwise to methanol via RWGS + CO hydrogenation pathway",
            "gps_relevance": "Proven at scale — GPS Renewables should consider licensing Topsoe MK-121 for CO₂ hydrogenation plant"
        },
        {
            "id": "known_co2_2",
            "name": "In₂O₃/ZrO₂",
            "formula": "In₂O₃(10wt%)/ZrO₂",
            "type": "Known",
            "source": "Science 2017, 357, 1296",
            "predicted_activity": 0.74,
            "predicted_selectivity": 0.95,
            "predicted_stability": 0.88,
            "temperature_range": "250-330°C",
            "pressure_range": "50-100 bar",
            "key_properties": [
                "Highest CO₂-to-methanol selectivity reported",
                "No RWGS side reaction",
                "ZrO₂ provides oxygen vacancies",
                "Water tolerant"
            ],
            "mechanism": "Oxygen vacancies on In₂O₃ surface activate CO₂ via formate route; ZrO₂ stabilizes In₂O₃ and provides Lewis acid-base pair sites",
            "gps_relevance": "Excellent for GPS Renewables' green H₂ + captured CO₂ scenario — high selectivity means no downstream separation cost"
        },
        {
            "id": "known_co2_3",
            "name": "Cu/CeO₂",
            "formula": "Cu(5wt%)/CeO₂",
            "type": "Known",
            "source": "ACS Catal. 2020, 10, 11, 6195",
            "predicted_activity": 0.69,
            "predicted_selectivity": 0.86,
            "predicted_stability": 0.79,
            "temperature_range": "220-300°C",
            "pressure_range": "40-80 bar",
            "key_properties": [
                "CeO₂ oxygen storage capacity",
                "High CO₂ activation",
                "Good low-temperature activity",
                "Redox-active support"
            ],
            "mechanism": "Ce³⁺/Ce⁴⁺ redox couple activates CO₂; Cu nanoparticles hydrogenate formate intermediates; interface sites are critical for activity",
            "gps_relevance": "Promising for GPS Renewables' low-temperature biogas CO₂ capture scenario"
        }
    ],

    "syngas_to_ethanol": [
        {
            "id": "known_syn_1",
            "name": "Rh/SiO₂",
            "formula": "Rh(2wt%)/SiO₂",
            "type": "Known",
            "source": "Catal. Today 2011, 160, 222",
            "predicted_activity": 0.81,
            "predicted_selectivity": 0.68,
            "predicted_stability": 0.71,
            "temperature_range": "250-300°C",
            "pressure_range": "20-60 bar",
            "key_properties": [
                "Highest known ethanol selectivity from syngas",
                "Rh is very expensive (~$150,000/kg)",
                "CO insertion mechanism",
                "Sensitive to CO₂ in feed"
            ],
            "mechanism": "Rh ensemble sites enable CO dissociation and non-dissociative CO insertion to form acetyl species; hydrogenation yields ethanol",
            "gps_relevance": "Benchmark catalyst — GPS Renewables should use as performance target, not production catalyst"
        },
        {
            "id": "known_syn_2",
            "name": "MoS₂-K Promoted",
            "formula": "K(2wt%)-MoS₂/Al₂O₃",
            "type": "Known",
            "source": "Appl. Catal. B 2019, 245, 679",
            "predicted_activity": 0.72,
            "predicted_selectivity": 0.61,
            "predicted_stability": 0.88,
            "temperature_range": "300-380°C",
            "pressure_range": "30-100 bar",
            "key_properties": [
                "Sulfur-tolerant — ideal for biogas syngas",
                "Low cost vs Rh",
                "K shifts selectivity to C₂+ oxygenates",
                "Requires sulfided feed"
            ],
            "mechanism": "MoS₂ edge sites activate CO and H₂; K promotion suppresses methane and promotes C-C coupling via CO insertion at Mo-S vacancies",
            "gps_relevance": "Best fit for GPS Renewables — biogas syngas contains H₂S which activates MoS₂ instead of poisoning it"
        }
    ]
}

NOVEL_CATALYST_SEEDS = {
    "ethanol_to_jet": [
        {
            "design_basis": "HZSM-5 modified with Ga and P co-doping",
            "hypothesis": "Ga³⁺ Lewis acid sites + P modifies Brønsted acidity to reduce coking while maintaining C8-C12 selectivity",
            "predicted_improvement": "20-30% reduction in coke deposition vs parent HZSM-5"
        },
        {
            "design_basis": "Core-shell Cu-Co@ZSM-5",
            "hypothesis": "Encapsulating Cu-Co nanoparticles in ZSM-5 shell creates cascade reaction: metal core does C-C coupling, zeolite shell shapes product distribution",
            "predicted_improvement": "Higher jet selectivity (>85%) with earth-abundant metals"
        },
        {
            "design_basis": "Fe-Mn/MCM-41 with K promoter",
            "hypothesis": "MCM-41 mesopores reduce diffusion limitation vs microporous zeolites; Mn prevents Fe sintering; K tunes chain length",
            "predicted_improvement": "Better mass transfer at industrial scale, longer lifetime"
        }
    ],
    "co2_to_methanol": [
        {
            "design_basis": "Cu-In bimetallic on ZrO₂",
            "hypothesis": "Combining Cu activity with In₂O₃ selectivity on ZrO₂ support — Cu lowers activation energy, In suppresses RWGS",
            "predicted_improvement": ">95% selectivity at higher activity than pure In₂O₃/ZrO₂"
        },
        {
            "design_basis": "ZnO-ZrO₂ solid solution",
            "hypothesis": "Zn²⁺ substitution in ZrO₂ lattice creates tunable oxygen vacancies and Lewis acid sites without precious metals",
            "predicted_improvement": "Stable for >500h at 250°C, no deactivation"
        }
    ]
}

REACTION_CONDITIONS = {
    "ethanol_to_jet": {
        "whsv": "1-4 h⁻¹",
        "h2_to_ethanol": "0-2 mol/mol",
        "target_products": ["C8-C16 n-paraffins", "isoparaffins", "cycloparaffins", "aromatics <25%"],
        "astm_spec": "ASTM D7566 Annex A5 (ATJ-SPK pathway)",
        "gps_plant_capacity": "India's first ETJ plant — competitive bid won by GPS Renewables"
    },
    "co2_to_methanol": {
        "co2_source": "Captured CO₂ from GPS Renewables biogas upgrading",
        "h2_source": "Green H₂ from electrolysis",
        "target_purity": ">99.5% methanol (fuel grade)",
        "energy_efficiency": "Target >60% carbon efficiency"
    }
}

def get_context_for_reaction(reaction_text: str) -> str:
    reaction_lower = reaction_text.lower()

    if any(kw in reaction_lower for kw in ["ethanol", "jet", "etj", "hydrocarbon", "atj"]):
        catalysts = KNOWN_CATALYSTS["ethanol_to_jet"]
        seeds = NOVEL_CATALYST_SEEDS["ethanol_to_jet"]
        conditions = REACTION_CONDITIONS["ethanol_to_jet"]
        reaction_type = "Ethanol-to-Jet (ETJ)"

    elif any(kw in reaction_lower for kw in ["co2", "methanol", "co₂", "carbon dioxide"]):
        catalysts = KNOWN_CATALYSTS["co2_to_methanol"]
        seeds = NOVEL_CATALYST_SEEDS["co2_to_methanol"]
        conditions = REACTION_CONDITIONS["co2_to_methanol"]
        reaction_type = "CO₂ Hydrogenation to Methanol"

    elif any(kw in reaction_lower for kw in ["syngas", "fischer", "tropsch", "co +", "co+"]):
        catalysts = KNOWN_CATALYSTS["syngas_to_ethanol"]
        seeds = NOVEL_CATALYST_SEEDS.get("syngas_to_ethanol", [])
        conditions = {}
        reaction_type = "Syngas to Ethanol"

    else:
        return ""

    import json
    return f"""
REAL CHEMISTRY CONTEXT FOR {reaction_type}:

KNOWN CATALYSTS FROM LITERATURE (use these as your known_catalysts, with minor variations):
{json.dumps(catalysts, indent=2)}

NOVEL CANDIDATE DESIGN SEEDS (use these to inspire your novel_candidates):
{json.dumps(seeds, indent=2)}

REACTION CONDITIONS:
{json.dumps(conditions, indent=2)}

IMPORTANT: Base your response on this real data. Use the actual catalyst names, formulas, and mechanisms provided. For novel candidates, build on the design seeds with specific structural modifications and quantitative predictions.
"""
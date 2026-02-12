package com.konderi.spo2seuranta.utils

/**
 * Medical guidelines for blood pressure based on age and gender
 * 
 * Sources:
 * - American Heart Association (AHA)
 * - European Society of Cardiology (ESC)
 * - WHO Blood Pressure Guidelines
 */

data class BPRange(
    val systolicMin: Int,
    val systolicMax: Int,
    val systolicOptimal: Int,
    val diastolicMin: Int,
    val diastolicMax: Int,
    val diastolicOptimal: Int,
    val category: BPCategory,
    val description: String
)

enum class BPCategory {
    OPTIMAL,
    NORMAL,
    HIGH_NORMAL,
    HYPERTENSION_GRADE1,
    HYPERTENSION_GRADE2,
    HYPOTENSION
}

enum class BPStatus {
    GOOD,
    WARNING,
    DANGER
}

data class BPGuidelines(
    val optimal: BPRange,
    val normal: BPRange,
    val highNormal: BPRange,
    val hypertensionGrade1: BPRange,
    val hypertensionGrade2: BPRange,
    val notes: List<String>
)

data class BPClassification(
    val category: BPCategory,
    val status: BPStatus,
    val message: String,
    val colorHex: String
)

object BPGuidelinesUtil {
    
    /**
     * Get blood pressure guidelines based on age and gender
     */
    fun getBPGuidelines(age: Int, gender: String?): BPGuidelines {
        return when {
            age < 40 -> getYoungAdultGuidelines()
            age < 60 -> getMiddleAgeGuidelines()
            age < 80 -> getOlderAdultGuidelines(gender)
            else -> getElderlyGuidelines()
        }
    }
    
    private fun getYoungAdultGuidelines() = BPGuidelines(
        optimal = BPRange(90, 119, 110, 60, 79, 70, BPCategory.OPTIMAL, "Optimaalinen verenpaine"),
        normal = BPRange(120, 129, 125, 80, 84, 82, BPCategory.NORMAL, "Normaali verenpaine"),
        highNormal = BPRange(130, 139, 135, 85, 89, 87, BPCategory.HIGH_NORMAL, "Tyydyttävä verenpaine"),
        hypertensionGrade1 = BPRange(140, 159, 150, 90, 99, 95, BPCategory.HYPERTENSION_GRADE1, "Lievä kohonnut verenpaine"),
        hypertensionGrade2 = BPRange(160, 200, 170, 100, 130, 105, BPCategory.HYPERTENSION_GRADE2, "Kohonnut verenpaine"),
        notes = listOf(
            "Nuorilla aikuisilla tavoitteena on optimaalinen verenpaine",
            "Naisilla voi esiintyä matalampia arvoja miehiin verrattuna",
            "Säännöllinen liikunta ja terveellinen ruokavalio tärkeää",
            "Jos verenpaine pysyvästi yli 140/90, ota yhteyttä lääkäriin"
        )
    )
    
    private fun getMiddleAgeGuidelines() = BPGuidelines(
        optimal = BPRange(90, 119, 115, 60, 79, 75, BPCategory.OPTIMAL, "Optimaalinen verenpaine"),
        normal = BPRange(120, 129, 125, 80, 84, 82, BPCategory.NORMAL, "Normaali verenpaine"),
        highNormal = BPRange(130, 139, 135, 85, 89, 87, BPCategory.HIGH_NORMAL, "Tyydyttävä verenpaine"),
        hypertensionGrade1 = BPRange(140, 159, 150, 90, 99, 95, BPCategory.HYPERTENSION_GRADE1, "Lievä kohonnut verenpaine"),
        hypertensionGrade2 = BPRange(160, 200, 170, 100, 130, 105, BPCategory.HYPERTENSION_GRADE2, "Kohonnut verenpaine"),
        notes = listOf(
            "Keski-iässä verenpaineen nousu on yleistä",
            "Miehillä riski sydän- ja verisuonitauteihin kasvaa",
            "Naisilla vaihdevuodet voivat nostaa verenpainetta",
            "Tavoitteena alle 140/90 mmHg",
            "Elintapamuutokset ovat ensisijainen hoito"
        )
    )
    
    private fun getOlderAdultGuidelines(gender: String?) = BPGuidelines(
        optimal = BPRange(90, 129, 120, 60, 84, 75, BPCategory.OPTIMAL, "Optimaalinen verenpaine"),
        normal = BPRange(130, 139, 135, 85, 89, 87, BPCategory.NORMAL, "Normaali verenpaine"),
        highNormal = BPRange(140, 149, 145, 90, 94, 92, BPCategory.HIGH_NORMAL, "Tyydyttävä verenpaine"),
        hypertensionGrade1 = BPRange(150, 159, 155, 95, 99, 97, BPCategory.HYPERTENSION_GRADE1, "Lievä kohonnut verenpaine"),
        hypertensionGrade2 = BPRange(160, 200, 170, 100, 130, 105, BPCategory.HYPERTENSION_GRADE2, "Kohonnut verenpaine"),
        notes = listOf(
            "Ikääntyneillä tavoite alle 150/90 mmHg",
            if (gender == "female") 
                "Naisilla vaihdevuosien jälkeen verenpaine usein korkeampi"
            else 
                "Miehillä sydän- ja verisuonitautien riski suurempi",
            "Liian alhainen verenpaine voi aiheuttaa huimausta",
            "Yläpaine voi nousta, alapaine usein laskee",
            "Säännöllinen seuranta tärkeää"
        )
    )
    
    private fun getElderlyGuidelines() = BPGuidelines(
        optimal = BPRange(100, 139, 130, 60, 89, 80, BPCategory.OPTIMAL, "Optimaalinen verenpaine"),
        normal = BPRange(140, 149, 145, 90, 94, 92, BPCategory.NORMAL, "Normaali verenpaine"),
        highNormal = BPRange(150, 159, 155, 95, 99, 97, BPCategory.HIGH_NORMAL, "Tyydyttävä verenpaine"),
        hypertensionGrade1 = BPRange(160, 169, 165, 100, 104, 102, BPCategory.HYPERTENSION_GRADE1, "Lievä kohonnut verenpaine"),
        hypertensionGrade2 = BPRange(170, 200, 180, 105, 130, 110, BPCategory.HYPERTENSION_GRADE2, "Kohonnut verenpaine"),
        notes = listOf(
            "Yli 80-vuotiailla tavoite alle 150/90 mmHg",
            "Liian alhainen paine voi lisätä kaatumisriskiä",
            "Huomioi muut sairaudet ja lääkitykset",
            "Yläpaine voi nousta merkittävästi",
            "Alapaine usein alhainen (alle 70 mmHg)",
            "Yksilöllinen hoitotavoite lääkärin kanssa tärkeää"
        )
    )
    
    /**
     * Classify blood pressure reading based on age and gender
     */
    fun classifyBP(
        systolic: Int,
        diastolic: Int,
        age: Int?,
        gender: String?
    ): BPClassification {
        // Use default age if not provided
        val userAge = age ?: 50
        val guidelines = getBPGuidelines(userAge, gender)
        
        // Check for hypotension (low BP)
        if (systolic < 90 || diastolic < 60) {
            return BPClassification(
                category = BPCategory.HYPOTENSION,
                status = BPStatus.WARNING,
                message = "Verenpaine on matala. Jos oireita (huimaus, väsymys), ota yhteyttä lääkäriin.",
                colorHex = "#0288D1" // Blue
            )
        }
        
        // Check optimal
        if (systolic <= guidelines.optimal.systolicMax && diastolic <= guidelines.optimal.diastolicMax) {
            return BPClassification(
                category = BPCategory.OPTIMAL,
                status = BPStatus.GOOD,
                message = if (age != null) 
                    "✓ Verenpaineesi on optimaalinen ikäryhmällesi ($userAge v)"
                else 
                    "✓ Verenpaineesi on optimaalinen",
                colorHex = "#2E7D32" // Green
            )
        }
        
        // Check normal
        if (systolic <= guidelines.normal.systolicMax && diastolic <= guidelines.normal.diastolicMax) {
            return BPClassification(
                category = BPCategory.NORMAL,
                status = BPStatus.GOOD,
                message = if (age != null)
                    "✓ Verenpaineesi on normaalilla alueella ikäryhmällesi ($userAge v)"
                else
                    "✓ Verenpaineesi on normaalilla alueella",
                colorHex = "#558B2F" // Light green
            )
        }
        
        // Check high-normal
        if (systolic <= guidelines.highNormal.systolicMax && diastolic <= guidelines.highNormal.diastolicMax) {
            return BPClassification(
                category = BPCategory.HIGH_NORMAL,
                status = BPStatus.WARNING,
                message = "Verenpaineesi on tyydyttävällä alueella. Seuraa säännöllisesti ja huolehdi elintavoista.",
                colorHex = "#F57C00" // Orange
            )
        }
        
        // Check grade 1 hypertension
        if (systolic <= guidelines.hypertensionGrade1.systolicMax || diastolic <= guidelines.hypertensionGrade1.diastolicMax) {
            return BPClassification(
                category = BPCategory.HYPERTENSION_GRADE1,
                status = BPStatus.WARNING,
                message = "⚠️ Verenpaine on koholla. Suosittelemme yhteyttä terveydenhuoltoon.",
                colorHex = "#E65100" // Dark orange
            )
        }
        
        // Grade 2 or higher
        return BPClassification(
            category = BPCategory.HYPERTENSION_GRADE2,
            status = BPStatus.DANGER,
            message = "⚠️ Verenpaine on merkittävästi koholla. Ota yhteyttä lääkäriin mahdollisimman pian.",
            colorHex = "#C62828" // Red
        )
    }
    
    /**
     * Calculate age from birth year
     */
    fun calculateAge(birthYear: Int): Int {
        val currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)
        return currentYear - birthYear
    }
    
    /**
     * Get personalized BP recommendations
     */
    fun getBPRecommendations(
        age: Int?,
        gender: String?,
        currentSystolic: Int? = null,
        currentDiastolic: Int? = null
    ): List<String> {
        val userAge = age ?: 50
        val recommendations = mutableListOf<String>()
        
        // Age-specific recommendations
        when {
            userAge < 40 -> {
                recommendations.add("Rakenna terveet elintavat nyt - ne maksavat itsensä takaisin myöhemmin")
                recommendations.add("Säännöllinen liikunta 150 min/viikko")
            }
            userAge < 60 -> {
                recommendations.add("Seuraa verenpainetta säännöllisesti")
                recommendations.add("Vähennä suolan käyttöä (alle 5g/päivä)")
                recommendations.add("Painonhallinta on tärkeää")
            }
            else -> {
                recommendations.add("Mittaa verenpaine samaan aikaan päivästä")
                recommendations.add("Älä nouse nopeasti ylös istuma- tai makuuasennosta")
                recommendations.add("Huomioi lääkityksen vaikutus verenpaineeseen")
            }
        }
        
        // Gender-specific
        if (gender == "female" && userAge >= 45) {
            recommendations.add("Vaihdevuodet voivat nostaa verenpainetta - keskustele lääkärin kanssa")
        }
        
        // Current reading specific
        if (currentSystolic != null && currentDiastolic != null) {
            val classification = classifyBP(currentSystolic, currentDiastolic, userAge, gender)
            
            if (classification.status == BPStatus.WARNING || classification.status == BPStatus.DANGER) {
                recommendations.add("Rajoita alkoholin käyttöä")
                recommendations.add("Vähennä stressiä rentoutumisharjoituksilla")
                recommendations.add("Lisää kasviksia ja hedelmiä ruokavalioon")
            }
            
            if (classification.category == BPCategory.HYPOTENSION) {
                recommendations.add("Juo riittävästi nesteitä")
                recommendations.add("Nosta jalkapäätä sängyssä")
                recommendations.add("Vältä pitkää seisomista")
            }
        }
        
        return recommendations
    }
}

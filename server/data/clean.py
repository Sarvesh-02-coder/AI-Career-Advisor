import json

# --------- MAINSTREAM SKILLS LIST (editable) ----------
MAINSTREAM = [
    "python","java","javascript","typescript","c++","c#","go","rust","php","ruby",
    "html","css","react","vue","angular","node","express","django","flask","spring",
    "sql","mysql","postgresql","postgres","sqlite","mongodb","redis","oracle",
    "git","github","gitlab","docker","kubernetes","linux","bash","shell",
    "aws","gcp","azure","firebase","terraform","ansible",
    "machine learning","deep learning","pytorch","tensorflow","scikit-learn",
    "nlp","computer vision","opencv","pandas","numpy",
    "excel","microsoft excel","power bi","tableau","hadoop","spark","mongo","mongodb"
]
# ------------------------------------------------------

def is_mainstream(skill: str):
    s = skill.lower()
    return any(key in s for key in MAINSTREAM)

# --------- LOAD JSON FILES ----------
with open("roles.json", "r") as f:
    roles = json.load(f)

with open("skills.json", "r") as f:
    skills = json.load(f)

# --------- CLEAN roles.json ----------
cleaned_roles = {}
for role, items in roles.items():
    cleaned_roles[role] = [skill for skill in items if is_mainstream(skill)]

# --------- CLEAN skills.json ----------
cleaned_skills = [skill for skill in skills if is_mainstream(skill)]

# --------- SAVE CLEANED FILES ----------
with open("roles_cleaned.json", "w") as f:
    json.dump(cleaned_roles, f, indent=2)

with open("skills_cleaned.json", "w") as f:
    json.dump(cleaned_skills, f, indent=2)

print("\n🎉 Cleaning Complete!")
print(f"Roles cleaned → roles_cleaned.json")
print(f"Skills cleaned → skills_cleaned.json")
print(f"Mainstream roles kept: {sum(len(v)>0 for v in cleaned_roles.values())}")
print(f"Empty roles: {sum(len(v)==0 for v in cleaned_roles.values())}")
print(f"Skills kept: {len(cleaned_skills)}")

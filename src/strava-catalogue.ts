// Strava's exercise_type for each public exercise of SmartWorkout's catalogue, by the id of the exercise. Names
// follow as comments, for reading only. `enduo-smartworkout strava-exercises` lists the exercises this table lacks;
// for those (and for an athlete's own exercises) the type is matched by name.
// Built 2026-11-21 from the 1163 public exercises of the catalogue.

export const STRAVA_EXERCISE_BY_ID: Readonly<Record<string, string>> = {
  '936daf5c-18b4-57f6-ba3e-184051b2cc12': 'REVERSE_HYPER', // 45-Degree Reverse Hyperextension
  '7dfa1962-138d-5c83-8af7-b3f26eedd84d': 'SIDE_BEND', // 45-Degree Side Bend
  '4c567ffb-4d07-417a-8142-f9d67088079e': 'NINETY_NINETY_HIP_ROLLS', // 90 To 90 Stretch
  '7e007fda-1f6a-514e-966b-1f793603d871': 'NINETY_NINETY_HIP_ROLLS', // 90/90 Hip Switch
  'cca919e2-fb73-5741-a45b-93d5134abcb3': 'NINETY_NINETY_HIP_ROLLS', // 90/90 Hip Switch with Hand Support
  '149f6670-3321-4e86-a231-796f1c26a1a4': 'AB_WHEEL_ROLLOUT', // Ab Wheel Rollout
  '16c5b229-a90d-73da-ea41-638c0dbd8e57': 'CRUNCH', // Abdominal Crunches
  '3f510e79-3565-48e1-8e07-5488912fd312': 'CRUNCH', // Abdominal crunches with legs on the ball
  'ca246429-a81b-4377-a492-231b6ca8ec61': 'CORE_GENERIC', // Abdominal Vacuum
  '7359f05e-8b81-449d-a741-8a1199116860': 'BICYCLE_CRUNCH', // Air Bike
  '9e5a71b9-7cdb-4090-83bd-efa2f49a418f': 'DUMBBELL_REAR_DELT_FLY', // Alternate Bent Over Dumbbell Reverse Fly
  'fedc49a5-593a-47fb-86db-7efdc8e6a7fe': 'STANDING_DUMBBELL_BICEPS_CURL', // Alternate Biceps Curl
  'd1c79bb9-e950-43b4-82a8-9b8003140b5e': 'DUMBBELL_HAMMER_CURL', // Alternate Dumbbell Hammer Curl
  '92fa0c44-7ad8-44a7-b960-4f6eae12b9b5': 'HANGING_KNEE_RAISE', // Alternate Hanging Knee Raises
  '85a22cf8-07b5-424a-bef6-637d9c5761dc': 'RENEGADE_ROW', // Alternate Renegade Row
  '329e6723-1f12-5f23-a31e-022d38767968': 'CARDIO_GENERIC', // Alternating Punches
  'f5570176-84be-50b3-8220-49874ef9ca8d': 'KETTLEBELL_SWING', // American Kettlebell Swing
  '03b44dbb-7517-432a-8906-17069ed494b2': 'BARBELL_BACK_SQUAT', // Anderson Squat
  'e7708c1b-2f41-4e99-b4c4-6f79f4c5fa1f': 'HEEL_TAPS', // Ankle Taps
  'b66a4710-2d36-56fd-87a6-bc132eb7f9d9': 'ARCHER_PULL_UP', // Archer Pull-Up
  '8dc5491f-a6ba-431f-bfe4-08e0ff285e4a': 'ARCHER_PUSH_UP', // Archer Push-Up
  '65cd4e80-8f47-4aba-9ca5-0a12185359b8': 'STANDING_DUMBBELL_BICEPS_CURL', // Arm Blaster Biceps Dumbbell Curl
  '88d568f5-de3e-4be1-b97d-265e802c6c1a': 'ARM_CIRCLES', // Arm Circle
  '08cde7c0-5988-4190-b12b-b0b565d113f6': 'ARM_CIRCLES', // Arm Circles
  'd8ad3cbb-b306-4f3d-8b67-4577038925b7': 'ASSAULT_BIKE', // Assault Air Bike
  '54cc8d9a-a680-5139-bcbc-ba1f94495b3c': 'ASSISTED_CHIN_UP', // Assisted Chin-Up
  '9b6a6436-6251-481a-87b9-5d1fdea90599': 'ASSISTED_CHEST_DIP', // Assisted Machine Dips
  'a5638dab-bc86-49ea-9940-f5423864f62b': 'ASSISTED_PISTOL_SQUATS', // Assisted Pistol Squat
  'b3ec93a9-729e-4e60-8944-d00b8a81f01f': 'MACHINE_ASSISTED_PULL_UP', // Assisted Pull-Up
  '870debd9-0006-5f32-9fea-1a494c94532c': 'TOTAL_BODY_GENERIC', // Atlas Stone Load
  '7049688f-6c75-454f-80a7-28b0a805c6b4': 'INVERTED_ROW', // Australian Pull-Up Underhand Grip
  '5eab927c-ca42-4b26-a3e2-0a7a8baf4063': 'STAGGERED_RDLS', // B stance landmine RDL
  'e657a4e4-a3b5-49da-95d5-a6a41db1272c': 'STAGGERED_RDLS', // B Stance Romanian Deadlift
  '873096f4-e814-47bf-9e4a-02ac68f3ade5': 'BACK_EXTENSION', // Back Extension
  '404f287b-adaa-4a66-bace-26872f17231c': 'BACK_EXTENSION', // Back Extension On Smith Machine
  'bd67f53b-0829-458b-8368-3bd89972ebe0': 'BACK_EXTENSION', // Back Extension With Dumbbell
  'd8467207-a5b3-4c53-a8e2-e798f1c47e86': 'CORE_GENERIC', // Back Lever
  '0ee339be-423c-559d-bd95-2db0a18e476c': 'MUSCLE_UP', // Band Assisted Muscle-Up
  'e0c03699-b927-4c57-933c-79020ffb2371': 'PULL_UP_GENERIC', // Band Assisted Pull Up
  '6d3741e2-2457-4505-a63c-324dc272d77c': 'BENCH_PRESS_GENERIC', // Band Bench Chest Press
  '37f5a2d4-b453-4971-a504-90d55d0933f6': 'LAT_PULLDOWN', // Band Bent Over Lat Pulldown
  '92576ea3-99fd-5243-90a1-30d323c91cdd': 'BENT_OVER_ROW', // Band Bent Over Row
  '01c5867e-2eb7-4f53-8b92-3a021d49cfea': 'CURL_GENERIC', // Band Biceps Curl
  'd4ef05f4-fe04-46e3-bb14-d060df537e28': 'BICYCLE_CRUNCH', // Band Bicycle Crunches
  '72a1cffa-0b27-4294-a558-d4f0580deb58': 'BAND_CHEST_FLY', // Band Chest Fly
  '67e01284-c882-5b68-a261-5bdb204da8fd': 'DEADLIFT_GENERIC', // Band Deadlift
  '9d581cd5-fea7-5d02-b4c8-faae2f5f3513': 'GOOD_MORNING', // Band Good Morning
  '8ab5f69f-e824-4fcf-9357-4e08c225d060': 'HALF_KNEELING_ROTATIONAL_CHOP', // Band Half Kneeling Chop
  '5d3e85c7-ad6f-4fa9-8b63-984f13c3b1ac': 'CURL_GENERIC', // Band Hammer Curl
  'ab0c9102-2325-49a2-92ce-4c6ed35a119d': 'ROW_GENERIC', // Band High Anchor Wide Row
  'c1b44da7-2220-4a21-8164-ebc2abf9ba65': 'STANDING_HIP_ABDUCTION', // Band Hip Abduction
  'ba4ae8e2-33f7-4d56-a37a-a2498b85e605': 'OBLIQUE_CRUNCH', // Band Kneeling Twisting Crunch
  '959aee3c-69de-4978-9332-2f6dbca6f4f9': 'LATERAL_RAISE_GENERIC', // Band Lateral Raise
  'e4022ea8-2ba8-46f2-8afb-9aa0b76bc6ef': 'BANDED_CLAMS', // Band Lying Clamshells
  '6c607284-0e60-4b4f-a656-9cafb87f4a9d': 'LEG_CURL_GENERIC', // Band Lying Leg Curl
  '3453606c-f6b9-48b0-ac7e-c98595957a41': 'PALLOF_PRESS', // Band Pallof Press
  '6d2a3622-980f-4d8f-aa00-852652cdd1d5': 'WARM_UP_GENERIC', // Band Pass Through Shoulders
  '8d741a7a-7ec1-57fa-a2bd-d24b7a8818e4': 'BAND_PULLAPARTS', // Band Pull-Apart
  '773ab473-077f-4ddb-baae-fff41adeb0f0': 'LAT_PULLDOWN', // Band Pulldown Behind Neck
  'c4c660f5-e07b-4ad8-a3a7-b887c3f8cc5e': 'REVERSE_HYPER', // Band Reverse Hyperextension
  '9bf94916-29ef-59bc-b0e4-8660f34e1d05': 'ROMANIAN_DEADLIFTS', // Band Romanian Deadlift
  '37fdb10c-13ce-4832-8730-0efc5dbb0eb2': 'RUSSIAN_TWIST', // Band Russian Twist
  'b4e2dca3-c85d-532f-b447-fd6b913b7d11': 'LEG_CURL_GENERIC', // Band Seated Leg Curl
  '376d314f-9b34-509b-b05e-9bbf2a571e34': 'CORE_GENERIC', // Band Seated Twist
  '046c9a3a-c89b-436a-ae57-f042aab8ad16': 'SHOULDER_PRESS_GENERIC', // Band Shoulder Press
  'fe62e8fc-5b16-4bab-bf08-f1e70b550bee': 'SQUAT_GENERIC', // Band Squat
  '4f000517-83d7-4c0c-81b3-1af736e0f91c': 'HIP_STABILITY_GENERIC', // Band Standing Balance Glute Kickback
  'a731e571-706d-5a43-aff5-463aeea87fdc': 'CHEST_PRESS', // Band Standing Chest Press
  '3c0abf43-2156-49b3-b86b-556e1837f59f': 'CRUNCH', // Band Standing Crunches
  '9dfc6c89-438e-5eb8-95cf-f3ea49309a07': 'SHOULDER_STABILITY_GENERIC', // Band Standing External Rotation
  '1d0eaa92-70e9-55b7-8ae7-63bdd22ff84f': 'STANDING_LEG_CURL', // Band Standing Leg Curl (Low Anchor)
  '4d63c4b8-8bf1-591b-a10a-34494f207e26': 'STANDING_LEG_CURL', // Band Standing Leg Curl (Under Foot)
  '0d70c540-52d7-41d0-b32d-448e6d0033ae': 'SIDE_BEND', // Band Standing Side Bend
  '18610132-0355-4f53-82e5-73fdd3a4450e': 'OBLIQUE_CRUNCH', // Band Standing Twisting Crunches
  'edae8b8e-efd3-4b72-b7c2-000604d3319c': 'TRICEPS_PRESSDOWN', // Band Triceps Pushdown
  '684999fc-af89-42cf-b915-97599db440b7': 'CORE_GENERIC', // Band Twist (horizontal)
  'ac407cf0-cc32-47ea-a68f-bf21017a15d1': 'CABLE_UPRIGHT_ROW', // Band Upright Row
  '73fe2fc2-e53c-4fbc-b137-1d02540c56ee': 'WARM_UP_GENERIC', // Band Warm-Up Dynamic Shoulder Stretch
  'badef5dd-c71e-5c0e-8776-5e90d770604b': 'ASSISTED_CHIN_UP', // Band-Assisted Chin-Up
  '1f377415-51bc-5ab6-ad8f-2bf2d78fc4fe': 'ASSISTED_CHEST_DIP', // Band-Assisted Dip
  '9b1d4ec9-e0b9-415a-96c2-cf24f3bb9e77': 'FACE_PULL', // Banded Face Pull
  '06744582-2ff9-4495-bdfb-6d10c13048d4': 'CABLE_BICEPS_CURL', // Bar Cable Biceps Curl
  '019a870f-c75a-96aa-addc-5bc492b68bc8': 'BARBELL_BEHIND_THE_HEAD_SHOULDER_PRESS', // Barbell Behind Neck Shoulder Press
  'dba6c9ac-e99c-4486-5c88-7ff4403c4608': 'BARBELL_BENCH_PRESS', // Barbell Bench Press
  '781a637f-61a2-4fd9-adf6-2578f7bc1f45': 'BARBELL_BENCH_PRESS', // Barbell Bench Press with Chains
  '0c3e27ed-e95b-7611-a3e8-7dab63585d21': 'BENT_OVER_BARBELL_ROW', // Barbell Bent Over Row
  '227db3f3-d33f-4f86-b14f-56f32f12d62b': 'BENT_OVER_BARBELL_ROW', // Barbell Bent Over Row From Pin
  '6f35ebb5-d31e-1ab7-310f-25b8cada0293': 'BARBELL_BICEPS_CURL', // Barbell Biceps Curl
  '11437756-14ac-4209-84bb-cda8bd5436c8': 'BARBELL_BICEPS_CURL', // Barbell Biceps Curl 777
  '20c44ab5-6563-5a0d-b750-1964d3aba1b6': 'SHOULDER_PRESS_GENERIC', // Barbell Bradford Press
  'ff743dcc-509e-48dd-bacd-694771441e27': 'BARBELL_BULGARIAN_SPLIT_SQUAT', // Barbell Bulgarian Squat
  '085cfcf8-548d-44df-8e92-eb9936752382': 'CALF_RAISE_GENERIC', // Barbell Calf Raise
  'c0163f74-9b9d-44f8-9ee9-78af5a3169cd': 'COSSACK_SQUAT', // Barbell Cossack Squat
  'b58d9bf9-6663-4eb7-917b-c1e3195b43f8': 'DRAG_CURL', // Barbell Drag Curl
  '07747821-38bb-4522-9f6b-b4ae4abf2282': 'BARBELL_FLOOR_PRESS', // Barbell Floor Press
  '60ea5c1b-50c1-49dd-aa89-f9ba8aae0fa6': 'BARBELL_LUNGE', // Barbell Forward Lunge
  '8a6508f0-65fa-4c20-9e1a-c8905b232b15': 'FRONT_RAISE', // Barbell Front Raise
  '7bb5b691-348a-4763-ba60-2ec25faf3965': 'BARBELL_PARTIAL_GLUTE_BRIDGE', // Barbell Glute Bridge
  '2811badd-ff6d-946b-c36f-aae77cd6fa38': 'BARBELL_GOOD_MORNING', // Barbell Good Morning
  '095b507f-9239-5ed7-92eb-4d1668241ff1': 'BARBELL_BENCH_PRESS', // Barbell Guillotine Bench Press
  '6910eb66-b93d-4fbe-a3ac-a50d9152ddbb': 'SQUAT_GENERIC', // Barbell Hack Squat
  '4059e331-670f-57f1-99e3-0609b0270190': 'BARBELL_HIGH_PULL', // Barbell Hang High Pull
  '5246f266-003c-7ce5-6be0-283f2136321e': 'BARBELL_HIP_THRUST', // Barbell Hip Thrust
  'a3e97dd5-11d7-4d60-98f7-9ed79a500ee5': 'BAR_HOLDS', // Barbell Hold
  'ddc441a1-c226-4a9d-8035-40a484173f38': 'CHEST_SUPPORTED_ROW', // Barbell Incline Wide Grip Row
  '224ad716-179a-4c0f-8dd9-049ad3e46884': 'BAR_HOLDS', // Barbell Izo Hold
  '5c4eda5a-7206-590a-ae48-d2b630f98fff': 'SQUAT_GENERIC', // Barbell Kneeling Squat
  '80d1410f-b7b0-4bb1-83f5-9fd2ea4b29f2': 'BARBELL_FEET_UP_BENCH_PRESS', // Barbell Larsen Press
  '68152684-1e2f-1ffb-39dc-fd1c741f63ac': 'BARBELL_UPRIGHT_ROW', // Barbell Narrow Grip Upright Row
  '247e913a-57cb-f102-d432-77de609ce049': 'OVERHEAD_BARBELL_PRESS', // Barbell Overhead Press
  'b8c23a28-ed2f-5a80-8281-b902ccad4191': 'BARBELL_SPLIT_SQUAT', // Barbell Overhead Split Squat
  'fd6bf4b3-3d1e-4036-b4c0-e6fded490b43': 'OVERHEAD_SQUAT', // Barbell Overhead Squat
  '9d80eba8-7872-41fc-879c-47632f253b44': 'EZ_BAR_PREACHER_CURL', // Barbell Preacher Curl
  '5ef57127-8673-4d29-a362-fdce93cd48f0': 'SPIDER_CURL', // Barbell Prone Incline Curl
  '62df860b-c893-4883-a66c-9b7be6a6bd63': 'DUMBBELL_PULLOVER', // Barbell Pullover
  '19862249-cbd3-4104-bcc0-b5ad1c21bd73': 'BARBELL_PUSH_PRESS', // Barbell Push Press
  '6ded7b8d-f4db-421f-bc3e-827bd7c9df81': 'RACK_PULL', // Barbell Rack Pull
  'f46bcb1e-3eff-49d3-adee-000a1502fd8d': 'LATERAL_RAISE_GENERIC', // Barbell Rear Delt Raise
  'b4eb0459-9ad3-4a47-8add-4c80872785b7': 'BENT_OVER_BARBELL_ROW', // Barbell Rear Delt Row
  '50c17111-7979-4354-85cc-62df98b2d62a': 'BARBELL_REVERSE_LUNGE', // Barbell Rear Lunge On Step
  '88f0b033-5d8a-5bca-a8fc-d50e98ceba92': 'BARBELL_BENCH_PRESS', // Barbell Reverse Grip Bench Press
  '9df4db0a-a574-4f3c-b6da-6c289bd1c508': 'REVERSE_GRIP_BARBELL_ROW', // Barbell Reverse Grip Bent Over Row
  '8662095d-cb00-1466-73f1-70394857c241': 'BARBELL_REVERSE_WRIST_CURL', // Barbell Reverse Grip Forearm Curl
  '8abc41c2-862b-4c51-81df-3a8c341a03d6': 'BARBELL_REVERSE_LUNGE', // Barbell Reverse Lunges
  'bf409651-d501-4f6f-b314-cd0cc5452063': 'BARBELL_REVERSE_WRIST_CURL', // Barbell Reverse Wrist Curl
  'b445a407-9f2f-477b-afa6-9be25ecefc35': 'BARBELL_ROLLOUT', // Barbell Rollout - Kneeling
  '85ee1bd7-ae5f-43ea-bef2-590f3e7e75ff': 'BARBELL_UPRIGHT_ROW', // Barbell Shoulder Grip Upright Row
  '963e4937-5b35-480d-e91e-f8f53b2cc64e': 'BARBELL_SHRUG', // Barbell Shoulder Shrug
  '49d5a7b1-678a-4e88-848b-a6468864bf2d': 'BARBELL_SHRUG', // Barbell Shrug Behind The Back
  '7cf8467c-4519-487c-b41e-7d874d7d3a8f': 'BARBELL_SPLIT_SQUAT', // Barbell Split Squat
  '145b65df-1575-4204-852c-0e3f24b29139': 'BARBELL_SQUAT', // Barbell Squat
  '5ee4154e-6595-4f89-92bf-b36ad01d149f': 'BARBELL_BEHIND_THE_BACK_BICEP_WRIST_CURL', // Barbell Standing Back Wrist Curl
  '56f2585b-203d-4be6-9957-c52bcd9e4d73': 'CORE_GENERIC', // Barbell Standing Twist
  '2fc473c6-c392-4036-8fa8-fdf760cb65d2': 'BARBELL_WRIST_CURL', // Barbell Standing Wrist Curl
  '214c92ad-dfe0-40a9-a697-d492de526d44': 'BARBELL_STEP_UP', // Barbell Step-up
  '6ee19894-3651-9c16-fdd7-39bfe1c755af': 'BARBELL_STRAIGHT_LEG_DEADLIFT', // Barbell Straight Leg Deadlift
  'af341e21-2cde-473a-b3f4-836e8e4a3d41': 'BARBELL_BOX_SQUAT', // Barbell Sumo Box SQ
  '325e9215-4fa0-4fe6-b368-cf1ea2827d5b': 'SUMO_SQUAT', // Barbell Sumo Squat
  '7132a06f-eea5-4cc1-bbf2-885b384c639c': 'THRUSTERS', // Barbell Thruster
  '9231a2c9-f7eb-43ae-a6b4-3686dcc7777d': 'TRICEPS_EXTENSION_GENERIC', // Barbell Triceps Pullover
  '5df2c7d2-f24b-4fd4-a358-6155858b088e': 'WALKING_LUNGE', // Barbell Walking Lunges
  'f0cc1e0a-c5a6-472c-bf62-6ac5056d34a3': 'BARBELL_BICEPS_CURL', // Barbell Wall Curl
  'd540e36e-0a23-5e7b-99db-1d5044657dd6': 'WIDE_GRIP_BARBELL_BENCH_PRESS', // Barbell Wide Grip Bench Press
  '5a4288af-d6e5-1b30-d668-4a6e3b55b399': 'BARBELL_UPRIGHT_ROW', // Barbell Wide Grip Upright Row
  'd9aea411-b71e-4105-ac8d-82746432c8f0': 'BARBELL_WRIST_CURL', // Barbell Wrist Curl
  'b60387b4-b1cc-5372-a2f4-5287a6db7ed1': 'Z_PRESS', // Barbell Z Press
  '8034fc0b-e020-42e4-90bb-55f2521e8572': 'BATTLE_ROPES', // Battle Ropes
  '0637306a-60ac-431c-89eb-f4a747ce6aa8': 'BAYESIAN_CURL', // Bayesian Cable Curl
  'a2168c01-69e1-46a8-a4e2-902cb3ea166a': 'BAYESIAN_CURL', // Bayesian Cable Curl (Face Away)
  '757ae740-c2ef-4a8d-9199-fd48ea06dcc9': 'BAYESIAN_CURL', // Bayesian Cable Curl Seated
  '89962002-6056-5180-948d-c2c5cc0c6be1': 'BEAR_CRAWL', // Bear Crawl
  'bb9968cb-20e4-47bd-8f4b-4991ca622fc7': 'PLANK_GENERIC', // Bear Plank
  '5551e8ad-26f3-4fd4-822a-1f90fc0f76ef': 'ROMANIAN_DEADLIFTS', // Belt Squat Machine Romanian Deadlift with V-Grip
  'dd3564b4-b057-4835-87ff-f87b619e07f5': 'BARBELL_FRONT_SQUAT', // Bench Front Squat
  'cb600c65-e1d1-42fa-874f-9568e52c8c48': 'BARBELL_BENCH_PRESS', // Bench Press With Resistance Band
  '8f6c0112-881e-5084-bb30-f624d9c80c69': 'REVERSE_HYPER', // Bench Reverse Hyperextension
  'e1964940-8d58-45ac-9edb-a63459417619': 'WALL_CHEST_STRETCH', // Bent Arm Chest Stretch
  '241b716d-5fcd-42ca-b987-5e78239d4ea2': 'DUMBBELL_REAR_DELT_FLY', // Bent Over Dumbbell Lateral Raise
  'd273b7a0-e5cd-4024-b6ab-20274a4b2b56': 'FLOOR_Y_RAISE', // Bent Over Dumbbell Y Raise
  '2d243c0b-02d2-4e67-8a63-dca09e86b55a': 'KETTLEBELL_ROW', // Bent Over Kettlebell Row
  '44e19c70-cc48-4916-aa31-9704b0976ba7': 'BICYCLE_CRUNCH', // Bicycle Crunch
  '465a9a4a-e854-4dba-be5b-51394c186eeb': 'BICYCLE_CRUNCH', // Bicycle Crunches
  'ed5e6c95-151e-46e2-9fbe-59ab50294ee3': 'BIRD_DOG', // Bird Dog
  'f5269fe9-4c03-44b9-a57c-25649650d382': 'BIRD_DOG', // Bird Dog Plank
  '5993086a-9f98-4a7f-9ff8-c870fa693f68': 'PUSH_UP_GENERIC', // Bird Dog Push-Up
  '3d8ca4a7-fc31-5bd2-95c5-3c580ca35001': 'SINGLE_LEG_BODYWEIGHT_ROMANIAN_DEADLIFTS', // Bodyweight Single-Leg Romanian Deadlift
  '0a75e037-9658-4706-a497-d7efe844e10b': 'KETTLEBELL_WINDMILL', // Bodyweight Windmill
  '43826952-c0ca-4aa1-8366-dfd50d52f99a': 'SHOULDER_PRESS_GENERIC', // Bottom KB Up Press
  'b8bf5d99-8df7-4eb8-aa9d-8bac39d070b7': 'SHOULDER_STABILITY_GENERIC', // Bottom up rotation
  '638760f0-0097-4315-bf13-4a613309eeb5': 'CRUNCH', // Box crunches
  '5fb31854-bd36-4046-a30f-8e80462af9a1': 'BOX_JUMP', // Box Jumps
  'd5f7a5ea-8fa8-48c3-aa0d-7e539dd3ac1a': 'BARBELL_BOX_SQUAT', // Box Squat
  '27149543-dc50-48eb-86f7-022e7ab1b591': 'STEP_UPS', // Box step-up
  '9765b518-63e8-401d-8ce0-fcc2415f176b': 'CARDIO_GENERIC', // Boxing Run
  '2b0bc722-5780-4466-a213-8aaa3611c7f7': 'GLUTE_BRIDGE', // Bridge Pose
  'ab1ace4a-9520-4b39-bc9b-20f63d191e11': 'BROAD_JUMP', // Broad Jump
  '35fe1fbc-aff9-4328-b105-c648d3e38a1b': 'WALKING_LUNGE', // Bulgarian Bag Walking Lunges
  'b119509d-00e5-45f4-b7a5-2aa4a5da4d0f': 'BODY_WEIGHT_JUMP_SQUAT', // Bulgarian Jump Squat
  'd4f99d40-b883-4371-8b5f-87fc11343709': 'DUMBBELL_BULGARIAN_SPLIT_SQUATS', // Bulgarian Squat
  '427c3808-4df4-4b0f-803b-de87e130a135': 'BARBELL_BULGARIAN_SPLIT_SQUAT', // Bulgarian Squat Smith
  'ba99f018-cb2a-48e9-b48b-57046f791ba7': 'BURPEE', // Burpee
  'de058729-9ac0-5098-b088-6fe04b8d49b9': 'CARDIO_GENERIC', // Butt Kicks
  'fa63a3e9-9bb3-41be-89d3-f37d22d9eebf': 'WARM_UP_GENERIC', // Butterfly Lean Forward Stretch
  'bd750d56-64a0-4e9f-87c9-b1408246238e': 'WARM_UP_GENERIC', // Butterfly Stretch
  'f50fa620-42a2-4306-9289-3e801068e662': 'CHEST_PRESS', // Cable Bench Press
  'dda38085-5edb-4b7a-a639-cb0059dc8c3a': 'CABLE_KICKBACK', // Cable Circle Kickback
  '91df77ee-5ffe-4d59-b1e5-885862ec28c3': 'CABLE_LAT_PULLDOWN_CLOSE_GRIP', // Cable Close Grip Lat Pulldown
  '0f7bb383-5b6c-4065-8d63-21b9925d37f0': 'CABLE_TRICEPS_PUSHDOWN', // Cable Cross Triceps Extension
  '373eb9d7-db5e-5b0e-a52f-4d78ffa35785': 'CABLE_KICKBACK', // Cable Diagonal Kickback
  'dea12dfc-58cb-482e-ad0e-3dba4c1f49f0': 'TRICEPS_EXTENSION_GENERIC', // Cable Double-Arm Tricep Kickback
  'c3edfed6-aeaa-58b6-a3f8-cba77931472f': 'FORTY_FIVE_DEGREE_CABLE_EXTERNAL_ROTATION', // Cable External Rotation
  '5847de4c-699f-4a50-a7a8-3815f8ddaf49': 'FACE_PULL', // Cable Face Pull
  '0d99097d-9865-470d-823e-a6170baf0631': 'FRONT_RAISE', // Cable Front Raise
  '911d89d5-deba-410f-aaf7-1fa6131bb06f': 'CABLE_KICKBACK', // Cable Glute Medius Kickback
  '245e0727-1c35-4965-aa28-0456d8969828': 'CABLE_HIP_ABDUCTION', // Cable Hip Abduction
  '99704170-da3e-48e5-bb24-33f8193d2892': 'STANDING_ADDUCTION', // Cable Hip Adduction
  'd0e78959-c1de-400c-a7fb-44c1015d5013': 'PALLOF_PRESS', // Cable Horizontal Pallof Press
  '0bc3273a-e419-43f3-a559-fa641860f75c': 'SKULL_CRUSHER', // Cable Incline Skull Crusher
  'a0b86085-81e0-4078-a297-68e3d6796c4e': 'SHOULDER_STABILITY_GENERIC', // Cable Incline Y Raise Back Supported
  '22223d93-39ce-4efc-a1f9-b008d4506834': 'CABLE_CROSSOVER', // Cable Kneeling High To Low Fly
  '412d4c49-4c4f-49c4-9d24-9cdd176000fa': 'OBLIQUE_CRUNCH', // Cable Kneeling Side Crunch
  '2ade8d6c-c91a-430f-96fc-da1d0f696526': 'LAT_PULLDOWN', // Cable Lat Pulldown
  'aac60f2b-2a58-6e5c-a473-fa6b1954a997': 'CABLE_LATERAL_RAISE', // Cable Lateral Raise
  '45b2f349-b237-4a59-95e5-dca57f979930': 'CABLE_CROSSOVER', // Cable Middle Chest Fly
  'cc39d401-ea05-f723-0500-64bbe65b589d': 'NEUTRAL_GRIP_LAT_PULLDOWN', // Cable Neutral Grip Lat Pulldown
  '70ff9832-f356-4c83-91b7-aec7d55babe8': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // Cable Overhead Triceps Extension
  'f6a2b92e-ea1f-4671-91a9-7e4313451e61': 'CABLE_BICEPS_CURL', // Cable Preacher Curl
  'a2a907c5-ff12-4065-bd7d-bc85ac4523e2': 'SINGLE_ARM_CABLE_CHEST_PRESS', // Cable Press Around
  '918edf74-fb94-41ae-af46-7cebebd231ad': 'HIP_SWING_GENERIC', // Cable Pull Through
  '8829eb3f-8a44-45c4-8a1b-038acb0e257d': 'CABLE_REAR_DELT_FLY', // Cable Rear Delt Fly
  'ace91b1e-8045-481d-8ab6-3a40f6593d8b': 'UNDERHAND_LAT_PULLDOWN', // Cable Reverse Grip Pulldown
  '32dc20b8-2efe-4740-8aa9-ec8ad29569dc': 'CABLE_RDL', // Cable Romanian Deadlift
  'dfa728cb-aef6-4b05-aca6-f6a4384c0a48': 'CABLE_RDL', // Cable Romanian Deadlift
  'b856f495-d868-4b6b-ac13-634bb99709b7': 'CABLE_REAR_DELT_FLY', // Cable Seated Rear Lateral Raise
  'b767db5f-87e1-42cf-b4dd-25f9899e0722': 'SEATED_CABLE_ROW', // Cable Seated Row Neutral Grip
  'c9c26dea-3563-47ab-b2bb-e93a3021cea1': 'SEATED_CABLE_ROW', // Cable Seated Supine Grip Row
  'd919d4f3-6cb0-4e11-b70a-3788dcc0a371': 'SHRUG_GENERIC', // Cable Shrug
  'a1e68be8-ded6-5a02-a384-9e4c94bdff3a': 'SQUAT_GENERIC', // Cable Squat
  '4ad778f6-7416-4755-a17a-5449201a0360': 'CURL_GENERIC', // Cable Squatting Curl
  'fa5a7a63-5bd3-4032-9116-acffb083597c': 'WRIST_ROLLER', // Cable Standing Wrist Roll
  'f138fba6-caa5-4541-b9fc-6b10b724d2d1': 'STEP_UP', // Cable Step Up
  '3ac761ff-672b-488c-bd22-3ded2b757e13': 'FACE_PULL', // Cable Supinated Face Pull
  'f9ac9620-8a9e-46e4-bab1-64d7412a868e': 'LEG_EXTENSIONS', // Cable Terminal Knee Extension
  '6a4145f4-8ef2-43f7-a9e9-51159327623e': 'ROW_GENERIC', // Cable Thibaudeau Kayak Row
  'a97e86f2-1e9a-2d2a-1968-a886c9c3560a': 'CABLE_TRICEPS_PUSHDOWN', // Cable Triceps Pushdown
  '0ec75482-1934-4b86-84d2-46da9a89d67d': 'STANDING_ROTATIONAL_CHOP', // Cable Twist (horizontal)
  '265b1439-6005-4282-94f7-ab6f63e0e296': 'UP_TO_DOWN_CABLE_TWIST', // Cable Twist (up down)
  '8d319000-4c1c-430b-bc4c-5871e12ecb47': 'ROW_GENERIC', // Cable twisting standing one arm row
  '2f8af6f8-5cd3-821e-ec81-1314359d9cfc': 'CABLE_UPRIGHT_ROW', // Cable Upright Row
  '1b067cc9-2501-41fc-97fe-cd35e92c3098': 'LAT_PULLDOWN', // Cable Wide Grip Behind Neck Pulldown
  '25472b18-efdc-438a-a2c2-ab72994be361': 'NEUTRAL_GRIP_LAT_PULLDOWN', // Cable Wide Neutral Grip Lat Pulldown
  'd1613595-46fa-4f15-9467-807cb3b2b88c': 'CURL_GENERIC', // Cable Wrist Curl
  'f26239fc-4bed-4f4f-a788-0e08235259a7': 'SHOULDER_STABILITY_GENERIC', // Cable Y Raise
  '187d7214-9b1e-4f2d-b028-f2aebd561d8b': 'MACHINE_CALF_PRESS', // Calf Leg Press
  'c98e66c4-2657-4c42-bfbb-99425b312dd2': 'TRICEPS_EXTENSION_GENERIC', // California Press
  'f8bff329-d28e-4a8a-b495-184fe80c7368': 'HANGING_KNEE_RAISE', // Captain's Chair Knee Raises
  '765217dc-7f1f-4c1e-b4d3-2c195d7a696c': 'LEG_RAISE_PARALLEL_BARS', // Captain's Chair Straight Leg Raises
  'e7f0998f-1ff9-4182-9063-6fea7af17f67': 'CAT_COW', // Cat Cow
  'f7c26828-f5f9-5b86-a638-dfab65c5ea45': 'CHAIR_DIPS', // Chair Dip
  'c0549306-022e-5a06-ab19-6532bc7bdff2': 'SQUAT_GENERIC', // Chair Sit-to-Stand
  '9e9c7445-89c9-4f3c-bd9c-fd27a6ae2e74': 'CHEST_DIP', // Chest Dips
  'ee5856e5-4386-4b4f-a42d-6eb14e6d02b6': 'WARM_UP_GENERIC', // Chest Molity
  'e481f458-6e2f-4a0d-b547-237c387844d0': 'CHEST_SUPPORTED_ROW', // Chest Supported Barbell Underhand Row
  'bfc234b1-e2be-440e-9d4d-02a46e063de3': 'SHOULDER_STABILITY_GENERIC', // Chest Supported Lateral T Raise
  '763906d6-42c5-7f93-c42a-553bdcf8d6f2': 'MACHINE_CHEST_SUPPORTED_ROW', // Chest Supported Machine Row
  '59c89f64-4dd9-4590-b70b-4dfc1d395407': 'T_BAR_ROW', // Chest Supported T-Bar Row
  'def5a3ce-9471-4cba-b1af-94cd85ff7e4c': 'CHILDS_POSE_LAT_STRETCH', // Child’s Pose
  'e2358283-3757-4804-9989-3bbccad0de40': 'PULL_UP_GENERIC', // Chin Hold
  '0026e45c-5fad-4e57-8a5f-c66453442a42': 'WARM_UP_GENERIC', // Chin tucks
  '1df9fd37-4223-4015-865e-cd6f641f78df': 'PULL_UP_GENERIC', // Chin-Up
  'c5d65cc0-0a23-44e5-bad9-b7986cdb2843': 'RING_PULL_UP', // Chin-up on rings with L-Sit
  '46959611-5bd7-5a89-8171-ad9c6f60e231': 'CLAMS', // Clamshell
  '8b216853-6ddd-4846-97e1-8a7fc15040cc': 'CLAP_PUSH_UPS', // Clap Push-Up
  'd60bf9ff-f74e-429c-afe1-cf5dec1b2ae6': 'CLEAN_AND_JERK', // Clean and Jerk
  '36aa677e-d126-5d17-9749-57a6877c40a1': 'BARBELL_DEADLIFT', // Clean Deadlift
  '1d4face7-3825-5b71-bee1-ec2a3676d45b': 'BARBELL_HIGH_PULL', // Clean Pull
  'ab969cd9-46c9-4a4b-aeb8-fb18b3a812d2': 'BARBELL_SQUAT_CLEAN', // Clean Squat
  '17d168cd-9745-60f3-f30f-7ec574eaf8a3': 'CLOSE_GRIP_BARBELL_BENCH_PRESS', // Close Grip Bench Press
  'b014b1c8-971b-4b80-b6b7-0de587ee5420': 'BENT_OVER_BARBELL_ROW', // Close Grip Bent-Over Row
  'aa88e9ad-b55e-43d7-b3c2-d0b0fb81a9a9': 'CURL_GENERIC', // Close Grip Biceps Curl
  '44a352b9-c532-4743-a47f-0d38aed169d2': 'CLOSE_GRIP_DUMBBELL_CHEST_PRESS', // Close Grip Dumbbell Press
  '41af656c-31a9-495d-8d86-2582e07f0ac8': 'INCLINE_DUMBBELL_BENCH_PRESS', // Close Grip Incline Dumbbell Bench Press
  'd7984438-e687-43db-ab4b-273e8240438e': 'LANDMINE_ROW', // Close Grip Landmine Row
  '0a7f804c-c8b2-410f-aaf2-596f30494ee9': 'PULL_UP_GENERIC', // Close Grip Pull Up
  '5d37f2ea-3a34-4db1-94ae-476306b7222e': 'DIAMOND_PUSH_UP', // Close Grip Push-Up
  '27ad6f30-088f-4665-88f0-9a0778b9d180': 'CLOSE_GRIP_BARBELL_BENCH_PRESS', // Close Grip Smith Bench Press
  '05993bed-9c87-4387-b2ac-e5fc7980152d': 'STANDING_EZ_BAR_BICEPS_CURL', // Close-grip EZ Bar Curl
  '3a5a9586-380f-4bfa-aa70-429003734604': 'PUSH_UP_GENERIC', // Cobra Push-Up
  '6c342334-8224-49a8-a88a-0d7225c58d18': 'WARM_UP_GENERIC', // Compression
  'b866a8c1-4083-403a-9a68-ba6846f85a87': 'CONCENTRATION_CURL', // Concentration Hammer Curl
  'de09c226-5ed2-4dca-8e72-26b8222b8cb7': 'CONVENTIONAL_DEADLIFTS', // Conventional deadlift
  '47fdda28-5887-5d45-aeca-5ada39824d44': 'SL_COPENHAGEN_PLANK', // Copenhagen Adduction
  '80962a97-6696-4ace-862a-5a53bfc12faf': 'SL_COPENHAGEN_PLANK', // Copenhagen Hold
  '86bb0542-38ab-469b-b684-77f566141bb7': 'COSSACK_SQUAT', // Cossack Squat
  '383ef024-5c2f-5368-a249-9123729de3ea': 'KNEELING_HIP_FLEXOR_STRETCH', // Couch Stretch
  '359ad0df-eef5-5ba6-9d06-81d2f1aefa07': 'PLYO_GENERIC', // Countermovement Jump
  '8a8beda5-c97c-4dad-b6c3-0d559584325d': 'WARM_UP_GENERIC', // Crab Pose
  '8b15bb82-a887-47bf-a9a9-62c21b3840d6': 'ROW_GENERIC', // Cross - Body Lat Pull Around
  '190a6523-03bb-4305-8a19-7ec55b680f15': 'PUSH_UP_GENERIC', // Cross Arms Push-Up
  '9e63f81b-fb83-44b7-8dda-895b64ca24b5': 'BENCH_PRESS_GENERIC', // Cross Body One-Arm Strength Press
  'd71a7936-d6e4-5df1-8639-b3c0f5f59b40': 'CURTSY_LUNGE', // Curtsy Lunge
  '3ebb776a-ae44-4115-94c9-069316692460': 'CURTSY_LUNGE', // Curtsy Lunges
  'a122b743-cb61-5c98-a8bd-1bea997674e7': 'CARDIO_GENERIC', // Cycling
  'e644b489-9a5e-4824-83fb-0b448b7c6a80': 'HEEL_ELEVATED_SQUAT', // Cyclist Squat
  'd3bf850a-ce13-4e0b-9ece-7822e9da8dfc': 'DUMBBELL_SPLIT_SQUAT', // DB Front Foot Elevated Split Squats
  '30e47e2a-3241-4f73-8180-2d02ed3b2557': 'DEADBUG', // Dead Bug
  'bcb5a949-1099-4324-8304-1f1ea768ac65': 'DEADBUG', // Dead Bug
  '5c3a0532-fe85-4225-8791-64b252bd4d40': 'DEADBUG', // Dead Bug with Ball
  'bcdc45cd-8548-4416-864f-fb0928b9da8a': 'DEAD_HANG', // Dead Hang
  'fa9f45b3-150b-4cb5-b4e3-8a641e34899d': 'DEADBUG', // Deadbug Alternating Chopp
  '20890a96-f92a-cfc8-3447-239d273136df': 'BARBELL_DEADLIFT', // Deadlift
  'e39ba212-23da-494e-b136-42060c32e7ce': 'RACK_PULL', // Deadlift from Blocks
  '69e26a9b-29bd-c232-8614-7985c1a70c15': 'BENCH_PRESS_GENERIC', // Decline Barbell Bench Press
  'c4144293-7b67-46de-a595-6c5953709954': 'SKULL_CRUSHER', // Decline Barbell French Press
  '73928937-811c-4f7a-967e-517e9ea509d9': 'CHEST_PRESS', // Decline Cable Chest Press
  '833d7f7c-e6ab-4796-97c7-17ebb035d33d': 'MACHINE_DECLINE_BENCH_PRESS', // Decline Chest Press
  'efda77ce-3d93-4efb-a581-cb8f7bc0df95': 'DECLINE_CRUNCH', // Decline Crunch
  'd47b60ff-9291-4a4a-b40f-6d74281ff2ab': 'DIAMOND_PUSH_UP', // Decline Diamond Push-Up
  'c30468f2-024b-79d4-df35-0c937e391555': 'DECLINE_DUMBBELL_BENCH_PRESS', // Decline Dumbbell Bench Press
  'ed078081-f64f-41e6-b31d-230e8d75cf43': 'DUMBBELL_FLYE', // Decline Dumbbell Fly
  '532b36c4-7a06-47c9-8264-0fa7b9a4e39e': 'DECLINE_PUSH_UP', // Decline Push-Up
  'f4e6f7fe-9615-558b-8e9e-64442224794a': 'SIT_UP_GENERIC', // Decline Sit-Up
  'd24ca3f6-1a19-41c4-9240-1369823e8a56': 'BENCH_PRESS_GENERIC', // Decline Smith Bench Press
  '2eeb0124-8dd0-4ef4-a089-8ea9f5956d6a': 'PUSH_UP_GENERIC', // Deep Push Up On Parallel Bars
  '2c08c473-5a61-4860-ae61-72380ac9d979': 'WARM_UP_GENERIC', // Deep Squat to Wide Fold with Foot Hold
  '114ad863-9971-40c3-8108-2a983fe656ae': 'BARBELL_DEADLIFT', // Deficit Deadlift
  '25f293a3-1b4e-4d7d-bc68-fdd75cf88ab9': 'SUMO_DEADLIFT', // Deficit Sumo Deadlift Under Knee Pause
  '2b8c9210-bac8-5b02-bfc9-391945a62624': 'DEPTH_JUMP', // Depth Jump
  'e2f7d20b-c5b0-46b4-8484-9adfd144ca6f': 'DEPTH_JUMP', // Depth Jump
  '0716159e-e991-422d-b4af-f88c38a00119': 'DIAMOND_PUSH_UP', // Diamond Push-Up
  '75add5d1-1906-4d70-b23a-998b632ce324': 'SHRUG_GENERIC', // Dip Shrugs
  '688d35de-f0ac-4a44-99e8-149ab5be3fa9': 'TRICEP_DIP', // Dips
  '38c5072e-3103-4399-8006-ae63d52110e5': 'DONKEY_KICKS', // Donkey Kick
  '976c168d-2968-4eb0-9ca0-eaf804f9ee6a': 'WALL_CHEST_STRETCH', // Doorway Chest Stretch
  'ff199fca-86ee-4407-a40b-bee06b8a8086': 'BENT_OVER_DUMBBELL_ROW', // Double Dumbbell Bent Over Row
  '45be866e-26ae-4be7-9d53-bb0a0d7e5d19': 'CURL_GENERIC', // Double Dumbbell Preacher Curl
  '989ee1f1-2417-58d9-a56b-95c870547202': 'KB_FRONT_RACKED_SQUAT', // Double Kettlebell Front Squat
  '9abd2cb8-a177-5b30-8769-3cf5eceafff6': 'ROMANIAN_DEADLIFTS', // Double Kettlebell Romanian Deadlift
  '1415c04c-54b1-5098-a8a0-79caf4b0d332': 'THRUSTERS', // Double Kettlebell Thruster
  '73727118-7a90-5c3c-a108-b8e21e4ca172': 'DOUBLE_UNDERS', // Double Under
  '5526faf0-d734-42c9-a045-50b31aecd615': 'WARM_UP_GENERIC', // Downward Dog
  '2e5461f9-54c1-426f-a2a5-a8dee9e1b751': 'DRAGON_FLAG', // Dragon Flag
  'dc9adb9a-c16a-4447-a2f3-b148be1cc50c': 'FRONT_RAISE', // Dumbbell Alternate Front Raise
  '76a20735-d6c9-7b27-c19e-6c2cf4a40bad': 'FRONT_RAISE', // Dumbbell Alternate Hammer Front Raise
  '71054169-cf36-c810-dca5-4413fe9a1327': 'STANDING_DUMBBELL_BICEPS_CURL', // Dumbbell Alternate Supinated Curl
  'f6ab64b1-a05f-5df3-873f-f90fccc9b336': 'KETTLEBELL_AROUND_THE_WORLD', // Dumbbell Around the World
  '986f0a86-2d1e-47c5-02c2-57659ac4e005': 'DUMBBELL_BENCH_PRESS', // Dumbbell Bench Press
  '4a808b86-385e-28a7-460b-aad50695af11': 'BENT_OVER_DUMBBELL_ROW', // Dumbbell Bent Over Row
  '835d99fc-dcdb-38f2-ca92-48e87ba6f5b1': 'STANDING_DUMBBELL_BICEPS_CURL', // Dumbbell Biceps Curl
  '16085da5-267a-572e-a093-67ee3d45c078': 'DUMBBELL_ROW', // Dumbbell Bird Dog Row
  'cf88eb6f-6101-49f1-a493-ef959eb12cb6': 'DUMBBELL_BULGARIAN_SPLIT_SQUATS', // Dumbbell Bulgarian Squat
  'f52c9de8-8b5e-f4d0-efe9-27b858230898': 'DUMBBELL_CHEST_FLY', // Dumbbell Chest Fly
  '658288ff-11ba-5945-a6c5-d04d58388dcd': 'DUMBBELL_CLEAN', // Dumbbell Clean
  'c8b4773c-e9ef-5dc8-b9ab-a511a82da5c6': 'DOUBLE_ARM_CLEAN_AND_PRESS', // Dumbbell Clean and Press
  'd01922bb-2606-4597-b0c0-352afe85ea8b': 'CONCENTRATION_CURL', // Dumbbell Concentration Curl
  '6b71cec6-7d3c-403f-bc1c-ed0787207ebe': 'COSSACK_SQUAT', // Dumbbell Cossack Squat
  'a4dfb157-1b04-4271-aa73-d122cd30acc8': 'CROSS_BODY_HAMMER_CURL', // Dumbbell Cross Body Hammer Curl
  '3ba7a9b4-88ba-4390-9593-de658b6668e6': 'SHOULDER_STABILITY_GENERIC', // Dumbbell Cuban Rotation
  'f1cb21f1-2e5b-5cf1-a9fc-b521d99bce4f': 'CURTSY_LUNGE', // Dumbbell Curtsy Lunge
  'f4528ef0-35e7-49de-a5b0-d1c2d03d97b3': 'DUMBBELL_DEADLIFT', // Dumbbell Deadlift
  'de8bc2c9-e7fc-4514-b6b5-f98f3e26cfa7': 'STRAIGHT_LEG_DEADLIFT', // Dumbbell Deadlift Straight Legs
  'fcaeb74b-a51b-4a0d-bf7d-f1e057539698': 'PUSH_UP_GENERIC', // Dumbbell Deep Push Up
  '64d51f46-9fa3-5985-86f4-1544eb0a0341': 'DEVIL_PRESS', // Dumbbell Devil Press
  '82a44bb7-594b-4b02-a196-2b05fce65bf4': 'DRAG_CURL', // Dumbbell Drag Curl
  '9836a9dd-c3fc-465c-8ae3-4defcbccf9c1': 'FARMERS_CARRY', // Dumbbell Farmer Carry
  '61e81b56-9baa-4959-9cd1-12103a45cd58': 'DUMBBELL_FLYE', // Dumbbell Floor Chest Fly
  '0ad70853-bd66-45d1-bfa2-9f57c2c9fd5f': 'FRONT_RAISE', // Dumbbell Front Raise
  'ceb3d76f-9f0f-5e2a-b860-f5e7fd87c0e2': 'SQUAT_GENERIC', // Dumbbell Front Squat
  '8081a73c-ad4d-48a6-830a-d94b5c4148bc': 'DUMBBELL_GOBLET_SQUATS', // Dumbbell Goblet Squat
  '62d8e1ae-e1fa-44f0-a2f0-8ad732d30942': 'OVERHEAD_DUMBBELL_PRESS', // Dumbbell Half Kneeling Shoulder Press
  '6b210054-5434-1bf3-923e-62e137c41216': 'DUMBBELL_HAMMER_CURL', // Dumbbell Hammer Curl
  'f549f56b-96d5-4eee-807b-427a437809df': 'DUMBBELL_HIP_THRUST', // Dumbbell Hip Thrust
  '89d00daa-f73b-4391-84d1-803ac433363e': 'INCLINE_DUMBBELL_BICEPS_CURL', // Dumbbell Incline Alternate Supinated Curl
  'e6a23c03-6fd4-41b7-8540-dac14e681294': 'LATERAL_RAISE_GENERIC', // Dumbbell Incline Chest Supported Lateral Raises
  '4786d67b-4ca5-40b9-8d97-488d60317e6a': 'DUMBBELL_HAMMER_CURL', // Dumbbell Incline Hammer Curl
  'eb8b2096-f9f0-4154-973b-35d9737d50da': 'INCLINE_REVERSE_FLY', // Dumbbell Incline Rear Lateral T Raise
  '36aff52a-c857-736a-ba6a-ccde6027fd61': 'SHOULDER_STABILITY_GENERIC', // Dumbbell Incline T Raise
  '5e41d753-27dc-4af1-852f-1ae2eda678c6': 'PLYO_GENERIC', // Dumbbell Jump
  '23aaf86c-d27a-4464-88d0-e3f88bb1ba4c': 'DUMBBELL_SHRUG', // Dumbbell Kelso Shrugs
  '5e119ca8-0a32-4a06-bf8c-37940087361d': 'DUMBBELL_BENCH_PRESS', // Dumbbell Larsen Press
  'ac965c65-7896-c2f8-4ab2-5bda19534b41': 'LATERAL_RAISE_GENERIC', // Dumbbell Lateral Raise
  '0301d2f1-94f6-5d0a-bb3c-8d0dfbe82c85': 'LATERAL_RAISE_GENERIC', // Dumbbell Lean-Away Lateral Raise
  'e15bca23-4fa2-4ca1-9c7f-f644e370e8c7': 'DUMBBELL_FLYE', // Dumbbell Low to High Fly
  'eb59667f-202d-49ce-a517-34c0ecbc69d4': 'LUNGE_GENERIC', // Dumbbell Lunges
  'e7a9f02b-6012-4ada-bf59-16ab85ee6b6d': 'LEG_CURL_GENERIC', // Dumbbell Lying Leg Curl
  '08ebb48f-60d2-44e9-91f9-930e37b8d841': 'DUMBBELL_WRIST_CURL', // Dumbbell Lying Pronation
  '83d39870-dd41-c0dc-5115-5067cb98c3dc': 'DUMBBELL_SKULLCRUSHER', // Dumbbell Lying Triceps Extension
  '8ed82d5b-8055-474e-9d6a-38bb83be1e02': 'CHEST_SUPPORTED_ROW', // Dumbbell Neutral Grip Incline Bench Row
  '4aa19f58-d5ec-5f7b-b310-71171b37d575': 'OVERHEAD_LUNGE', // Dumbbell Overhead Lunge
  '70d72480-4313-5ec3-939f-5bf99b763474': 'OVERHEAD_SQUAT', // Dumbbell Overhead Squat
  'cbafebcc-8125-5113-b1d7-9bae7640a101': 'PLANK_PULL_THROUGH', // Dumbbell Plank Pull-Through
  'b7f66997-117e-4893-acc6-6ad18adffdb1': 'LATERAL_RAISE_GENERIC', // Dumbbell Poliquin Lateral Raise
  '68fd5792-ddb1-4b46-8842-3cd11b0d7e8b': 'SHOULDER_PRESS_GENERIC', // Dumbbell Poliquin Press
  'e2b119ab-ec23-4688-9449-535340f3d4f9': 'DUMBBELL_PULLOVER', // Dumbbell Pullover
  'c97aad0b-f9f1-4533-918a-fc23a466b854': 'DUMBBELL_PULLOVER', // Dumbbell Pullover with Legs Raised
  '0349439c-c56e-4bd8-88b9-7bf9b00f3811': 'DUMBBELL_PUSH_PRESS', // Dumbbell Push Press
  'e9421df5-65a2-4fac-8dfa-bf2552e9f755': 'ROW_GENERIC', // Dumbbell Rear Delt Row
  '87956366-b6ca-49aa-8fa5-3423c3787e94': 'DUMBBELL_REVERSE_LUNGE', // Dumbbell Rear Lunge
  '3c70051c-4428-496f-aa6c-08015bb0150b': 'RENEGADE_ROW', // Dumbbell Renegade Row
  'c8a73206-c24b-46e7-9f38-b9e049a3afe5': 'CURL_GENERIC', // Dumbbell Reverse Curl
  '127dc619-8078-4148-907b-e08a49f1676a': 'DUMBBELL_REVERSE_LUNGE', // Dumbbell Reverse Lunge off Step
  'ea0437ea-81fe-4d5e-aa72-cf592ae1c11d': 'DUMBBELL_ROMANIAN_DEADLIFTS', // Dumbbell Romanian Deadlift
  'a3da9e1f-b976-4458-92f4-4af1264793fa': 'DUMBBELL_RUSSIAN_TWIST', // Dumbbell Russian Twist
  '5d175483-a70f-418a-8ee1-b4434087df4e': 'SEAL_ROW', // Dumbbell Seal Row
  'e6fa5387-c06a-4647-ae72-92357692edc6': 'DUMBBELL_HAMMER_CURL', // Dumbbell Seated Alternate Hammer Curl
  '890ca0c8-ff8d-4f2b-ad34-d9743118bfee': 'BENT_OVER_DUMBBELL_ROW', // Dumbbell Seated Bent Over High Row
  'a3ad7b37-2b83-570b-889a-3436dd85ea22': 'LEG_EXTENSIONS', // Dumbbell Seated Leg Extension
  '9481d369-1493-4a72-b758-e0c1870c9b1d': 'OVERHEAD_DUMBBELL_TRICEPS_EXTENSION', // Dumbbell Seated Triceps Extension
  'c4aa256a-753d-4b96-88fc-5c52907c648a': 'OVERHEAD_DUMBBELL_TRICEPS_EXTENSION', // Dumbbell Seated Triceps Extension
  '61fb6b76-1d67-48f8-abba-bca2c60db1f9': 'DUMBBELL_SHRUG', // Dumbbell Shoulder Shrugs
  '15f450f0-f4f1-4391-b59e-c79cd37956ac': 'SIDE_PLANK', // Dumbbell Side Bridge
  '850e7678-377e-475c-81d9-1f4f8c22d5a0': 'SIDE_LUNGE', // Dumbbell Side Lunges
  '0b59dd85-d65d-4e28-bad1-2a74fc204504': 'DUMBBELL_SINGLE_LEG_HIP_THRUST', // Dumbbell Single Leg Hip Thrust
  'c9941df5-0d16-59e2-8234-326c8279d083': 'OVERHEAD_CARRY', // Dumbbell Single-Arm Overhead Carry
  'bb8bde33-62a0-46c9-9bbf-d11b93374161': 'SINGLE_ARM_DUMBBELL_SNATCH', // Dumbbell Snatch
  '174978b8-1b92-4700-96d0-98d1835628dd': 'SPIDER_CURL', // Dumbbell Spider Curl
  '30fec8f3-59a5-4d4f-9988-972018248c9f': 'DUMBBELL_SPLIT_SQUAT', // Dumbbell Split Squat
  '3f65c493-34ba-40ed-9098-b9ffc5e506b2': 'DUMBBELL_SQUAT', // Dumbbell Squat
  '72beba88-80ce-4d8b-8dee-a3e8c490794e': 'DUMBBELL_SQUAT', // Dumbbell Squat Pulse
  '98055ba3-3b26-463f-8ed8-ef7f2811bede': 'DUMBBELL_PUSH_PRESS', // Dumbbell Standing Alternate Press
  '9b56a5dd-d22c-40cc-a93c-05338cc45585': 'STANDING_CALF_RAISE', // Dumbbell Standing Calf Raises
  'c1af5fc6-a3be-4467-87f9-b4e8abb1f55e': 'SHOULDER_PRESS_GENERIC', // Dumbbell Standing Driver
  'b2c6ca4b-db03-4553-8d9f-6e5e87bbd118': 'DUMBBELL_REVERSE_WRIST_CURL', // Dumbbell Standing Reverse Wrist Curls
  '9f9a7752-0ad7-44e9-a025-d68e9ac1a419': 'DUMBBELL_SIDE_BEND', // Dumbbell Standing Side Bend
  '4c88201a-d81c-4c88-b0e2-9b58a5f2e0b1': 'DUMBBELL_WRIST_CURL', // Dumbbell Standing Wrist Curl
  'a63c8518-6ecd-44df-a7ce-20fc9957bc6a': 'STEP_UP', // Dumbbell Step-Up
  '8213817c-7777-4373-bbf6-654fac9db202': 'STRAIGHT_LEG_DEADLIFT', // Dumbbell Straight Leg Deadlift
  'aa7214e6-32af-5e33-9293-0d9edd53b755': 'DUMBBELL_DEADLIFT', // Dumbbell Suitcase Deadlift
  'a0a318a5-3d7f-58f7-a0ef-13ffd023be99': 'SUMO_DEADLIFT', // Dumbbell Sumo Deadlift
  '9f23fc45-85b5-4fb8-a6f5-615cd230928f': 'SUMO_SQUAT', // Dumbbell Sumo Squat
  '9521baf0-58d3-450a-acaa-d5a27cd5bd27': 'STANDING_DUMBBELL_BICEPS_CURL', // Dumbbell Supinated Curl
  '293c61e4-0955-4504-a40d-3b671498ad97': 'CURL_GENERIC', // Dumbbell Supinated Preacher Curl
  '7243296e-854c-5095-ae36-35121dd5111b': 'HIP_SWING_GENERIC', // Dumbbell Swing
  'de8c6eb6-9484-56b5-9de5-ce1a7e00c0f2': 'DUMBBELL_THRUSTERS', // Dumbbell Thruster
  '7074ca94-a20d-cfa8-7702-b59e4bd31ab9': 'BARBELL_UPRIGHT_ROW', // Dumbbell Upright Row
  '83dddb0c-9472-4a5f-b00a-ab2acfbf1254': 'CURL_GENERIC', // Dumbbell Waiter Curl
  '6dd46aa0-9539-260b-8885-77d56241439b': 'DUMBBELL_WALKING_LUNGES', // Dumbbell Walking Lunges
  'ab0ed063-c4fc-5e05-af13-2c1693c02962': 'Z_PRESS', // Dumbbell Z Press
  'a84ebb91-aca3-40b6-a346-2f5a8531b450': 'OVERHEAD_CARRY', // Dumbell overhead carry
  'caf218d7-eacb-5228-b074-fee5284e8436': 'CORE_GENERIC', // Elbow Lever
  'ae4654cc-cd5b-4aef-81de-28e6eff721f7': 'WALL_CHEST_STRETCH', // Elbow Out Chest Stretch
  'f016934d-a83f-45e1-944d-3734752c2f44': 'WARM_UP_GENERIC', // Elbows Out
  'a464ad90-8802-40ac-bf44-a414b1b504bd': 'CARDIO_GENERIC', // Elliptical Trainer
  '06e746da-639e-4af3-acb7-ffdeff373cfc': 'CLAP_PUSH_UPS', // Explosive Push Up
  '5cd4a725-e9e7-4677-a24a-1b83ce5da740': 'STANDING_EZ_BAR_BICEPS_CURL', // EZ-Bar Biceps Curl
  'b78b80f8-00a5-53f3-a2ed-b425ffdcd4ac': 'STANDING_EZ_BAR_BICEPS_CURL', // EZ-Bar Bottom-Half Biceps Curl
  '38709d78-13c4-45d5-ac56-b42c86866412': 'EZ_BAR_PREACHER_CURL', // EZ-Bar Preacher Curl
  'b03f3b8c-b957-4838-b198-eeda7a389132': 'BARBELL_REVERSE_CURL', // EZ-Bar Reverse Grip Biceps Curl
  'f0020a27-c8da-5a08-80c0-6c7d62cb3153': 'EZ_BAR_PREACHER_CURL', // EZ-Bar Reverse Grip Preacher Curl
  '91c42a1f-9c3c-4b39-8325-177d96e6c806': 'SPIDER_CURL', // EZ-Bar Reverse Spider Curl
  '24143ad6-3b55-459f-bdac-b8721dd1e668': 'BARBELL_REVERSE_WRIST_CURL', // EZ-Bar Seated Reverse Wrist Curl
  '305f4776-36d5-45a1-aae9-9671e419c430': 'SEATED_BARBELL_OVERHEAD_TRICEPS_EXTENSION', // EZ-Bar Seated Triceps Extension
  '8008ee41-c9d1-42a3-8ea5-773f9f954230': 'BARBELL_WRIST_CURL', // EZ-Bar Seated Wrist Curl
  '9f11cb88-a5a3-49a9-b8b3-14d535803a6b': 'SPIDER_CURL', // EZ-Bar Spider Curl
  '79e5f9db-193b-4458-8422-d444fa75336a': 'TRICEPS_PRESSDOWN', // EZ-Bar Tricep Pushdown
  '2f471d53-3998-40e5-bfb3-542da8be66af': 'FARMERS_WALK', // Farmer Walk
  '28adcc02-45b8-5fa1-a01d-a896a80883bb': 'BENCH_DIP', // Feet-Elevated Bench Dip
  '51f6c2dd-f5ef-49ed-b10c-8538ac8330ac': 'LYING_PIRIFORMIS_STRETCH', // Figure 4 Stretch on Chair
  'eb35e6eb-4b33-4d2f-a100-99079c086284': 'PUSH_UP_GENERIC', // Finger Push-Up
  '01e82f32-0ea2-5c4c-ae23-01119f016c66': 'FIRE_HYDRANT_KICKS', // Fire Hydrant Kick
  '9d9a38ee-21ac-40ad-ad39-0cb2c09a4b88': 'CORE_GENERIC', // Flag
  '3339b89d-601e-5eeb-a551-deb1b513413d': 'LYING_STRAIGHT_LEG_RAISE', // Flat Bench Lying Leg Raise
  '4eb45701-1c6d-46b7-a427-24f80a43837c': 'DUMBBELL_FLOOR_PRESS', // Floor Dumbbell Press
  '925b9508-e34a-44e1-b635-5d6f1b81b9d9': 'LATERAL_WALKS_WITH_BAND_AT_ANKLES', // Forward Band Monster Walk
  '16f2f5f0-7ad6-501f-8981-4cb9ee9526c8': 'HANDSTAND_HOLD', // Freestanding Handstand
  '7d9e0403-7208-47e8-9488-b1bc85cb9bce': 'CRUNCH', // Frog Crunch
  'b6f06f63-a9c4-585e-9b94-c87b41d02760': 'PLYO_GENERIC', // Frog Jump
  '5e5e5c5f-0e1d-4827-b76d-c2f87d4ac410': 'PLANK_GENERIC', // Frog Planche
  'c79993c0-52a1-4575-94f6-9e63c75453be': 'FROG_PUMP', // Frog Pump
  '7c9245a8-f0ca-5c2a-8803-c9c3d4fd1b91': 'SWIMMING', // Front Crawl Swimming
  'e6e703e3-77f2-45e1-b211-3cf5aceb0d80': 'FRONT_LEVER_HOLD', // Front Lever
  '28ad1245-c026-45e9-b1db-34c169e6b8c3': 'PULL_UP_GENERIC', // Front Lever Pull-Up
  '49447a3b-1edb-5947-76e0-1a67e587cee5': 'BARBELL_FRONT_SQUAT', // Front Squat
  '47842d2f-f208-4c29-ad46-f54b54963d06': 'PLANK_GENERIC', // Full Planche
  'd8a5dc02-4460-4bb0-baba-2e12799b1988': 'PUSH_UP_GENERIC', // Full Planche Push-Up
  '1d5e0f91-6491-5b38-a12d-63da4acf3bd9': 'GHD_SIT_UP', // GHD Sit-Up
  '6151909d-a462-46b8-a8dd-e418c243fba3': 'GLUTE_BRIDGE', // Glute Bridge
  '90b6bf6a-8cf4-5aa2-8848-dc61fcdcf799': 'GLUTE_BRIDGE', // Glute Bridge March
  'a408662a-d8a8-4d17-9544-fa2ce09356db': 'GLUTE_BRIDGE', // Glute Bridge on Bench
  'fd0bc7ef-9983-4afc-b2c9-e1f9e273f566': 'SINGLE_LEG_GLUTE_BRIDGE', // Glute Bridge Single Leg
  '56239031-492b-5c18-a1c1-59624943c04d': 'HAMSTRING_WALKOUT', // Glute Bridge Walkout
  '66560c14-c119-4d53-b8ad-d075f2ccea2c': 'CABLE_KICKBACK', // Glute Cable Kickback
  'ca1622b4-f6ca-44eb-b219-cdb52a98ac80': 'HIP_RAISE_GENERIC', // Glute Crushers
  '98e32b35-8efa-4e40-bff6-d414f8297dd1': 'MACHINE_GLUTE_KICKBACK', // Glute Machine Kickback
  '8dcc0b41-7486-485d-aa85-c09fa57537eb': 'GLUTE_HAM_RAISE', // Glute-Ham Raise 1/2
  '844fd563-697e-4abc-974f-5894f3c1d657': 'WARM_UP_GENERIC', // Glutes Roll
  '7bdabdd2-8124-40d5-92b7-6038a087bc9b': 'GOBLET_SQUAT', // Goblet Squat
  '35d975b5-dfd2-4bc1-b3f6-6cae96604d4a': 'GORILLA_ROW', // Gorilla Row
  'c4a8e93f-9a2a-5086-aa3a-3ecbc334d4ca': 'MACHINE_CALF_PRESS', // Hack Squat Machine Calf Raise
  '3c1c6567-b378-4b18-81da-ed993d7ba701': 'KETTLEBELL_HALO', // Half kneeling HALO
  '5bf3ca9d-6d66-49eb-be24-2fcb61b9bda5': 'STANDING_QUAD_STRETCH', // Half Kneeling Quad Stretch
  '65e0d493-ff1c-4492-a82a-109167974678': 'SEATED_DUMBBELL_SHOULDER_PRESS', // Half Kneeling Shoulder Dumbbell Press
  '0bcffb2d-f78d-48b8-a3d8-3b49f166a66f': 'BARBELL_SQUAT', // Half Squat
  '65500534-b8d9-4aee-a841-28b69a12cf58': 'NEUTRAL_GRIP_DUMBBELL_BENCH_PRESS', // Hammer Grip Dumbbell Bench Press
  'cc1b6a0f-963d-40d9-a361-1f078737faae': 'CORE_GENERIC', // hand to foot stability ball pass
  '3c9ee543-6ff9-5385-bdc1-6bdae8bddcea': 'PUSH_UP_GENERIC', // Hand-Release Push-Up
  'fcbd7cf4-0be9-4c9f-8f10-fcb81de7a316': 'HANDSTAND_HOLD', // Handstand Hold
  '9c1ee795-e406-4b2e-872b-d9c7edc487dd': 'HANDSTAND_PUSH_UP', // Handstand Push-Up
  '92658198-e494-5609-ae27-ade43720ee44': 'HANDSTAND_HOLD', // Handstand Walk
  '1c5b944c-cb68-5cde-84ff-20a8322f25e2': 'BARBELL_HANG_SQUAT_CLEAN', // Hang Clean
  '642e9efb-4dc4-41a7-8e84-56dcea274c86': 'BARBELL_HANG_POWER_CLEAN', // Hang Power Clean
  '9ead75d4-c1f8-4366-9e62-2274f90f416a': 'BARBELL_SNATCH', // Hang Snatch
  '5a9aa9a7-2666-4fb4-a56c-ace7b6d4602d': 'HANGING_KNEE_RAISE', // Hanging Garhammer Raise
  'a65c12ab-688e-47bf-966c-994dcc71ec89': 'HANGING_LEG_RAISE', // Hanging Half Windmill
  '79b4b650-53d9-4e87-8bd8-7143d3f7802d': 'HANGING_KNEE_RAISE', // Hanging Knee Circles
  '5bdc3ef8-bce5-4f48-a96f-e5d345a20ace': 'HANGING_KNEE_RAISE', // Hanging Knee Raise Oblique And Front
  'e9cd8dfe-d2be-42be-b259-d1d3fc671aa9': 'HANGING_KNEE_RAISE', // Hanging Knee Raises
  '2a7a20b2-edc3-4565-8bdb-e7f56247ee26': 'HANGING_KNEE_RAISE', // Hanging Knee To Chest
  '51e27022-23d5-4196-aa85-a3b2f1c213b4': 'HANGING_KNEE_RAISE', // Hanging Knees to Elbows
  '5e34780b-d33a-4637-bd4c-2b282149bad7': 'HANGING_KNEE_RAISE', // Hanging Knees to Elbows Waist
  '806178d3-cc6d-4295-8263-a21ea9be34b7': 'TOES_TO_BAR', // Hanging Leg Raise To Bar
  'd53971e5-7438-4a9e-b041-0158b3142546': 'HANGING_KNEE_RAISE', // Hanging Oblique Knee Raise
  'e762a17b-0ca0-4f27-8058-7faff79d7cf9': 'DEAD_HANG', // Hanging On Bar With Bent Arms
  'd723ed09-c017-4ea4-8f63-90c1a00cbb6a': 'SCAPULAR_RETRACTION', // Hanging Scapular Retractions
  '14046b3a-d435-4452-925e-511a8addfffb': 'HANGING_LEG_RAISE', // Hanging Scissors Kicks
  '88d01eae-b72c-4649-8178-0be9633ec6d2': 'HANGING_LEG_RAISE', // Hanging Straight Leg Raise
  'f6468090-67cf-4fdc-ab45-49b41b28037b': 'STRETCH', // Happy Baby Pose
  'eba0700e-504d-5dc8-b302-12df973909a8': 'TOTAL_BODY_GENERIC', // Head Harness Neck Extension
  '94c146d4-89a6-457b-a2b3-6a409ab74d45': 'CABLE_CURL', // Hercules Curl
  '3ca9438d-12c8-4eed-a193-0b140808357a': 'CURL_GENERIC', // High Cable Wrist Curl
  '14e0e206-a2de-575c-8531-c3c68405ad55': 'HIGH_KNEES', // High Knees
  '048f0d34-855e-4bff-ff32-a2d851a8757d': 'CABLE_CROSSOVER', // High Low Cable Chest Fly
  'e48132f8-7ba2-5791-bc03-cf74de076126': 'PLANK_HOLD', // High Plank
  'fae3a576-4c85-410c-b4fd-a39d8c8c66c2': 'PULL_UP_GENERIC', // High Pull Up
  '706acd4f-c5f6-4aa7-95d2-af551214e447': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // High Pulley Overhead Triceps Extension
  '8929de5f-b029-4ffd-a773-744cfc6ef113': 'CABLE_WOODCHOP', // High To Low Band Woodchopper
  '25cbefe9-8ebb-416a-8d6f-cbef5b14a585': 'BARBELL_BACK_SQUAT', // High-Bar Squat
  '883d8808-3994-4bdf-aef6-ef9413aee9be': 'STANDING_HIP_CIRCLES', // Hip Circles
  'b805ce84-2b5c-4cd1-8bb3-a8cc53c44b49': 'DEADLIFT_GENERIC', // Hip Hinge
  '7ce01b32-14e6-4185-b499-137ba4f99177': 'HIP_THRUST', // Hip Thrust
  '87c56061-0902-4bc5-8865-bb2a3f6f9e6c': 'STAGGERED_HIP_THRUST', // Hip Thrust B-Stance
  '442206c2-d2f1-413e-a73f-52b5dd819eb1': 'HIP_THRUST', // Hip Thrust Smith Machine
  '51d72d15-d7d7-405f-9f17-6495d88f2dac': 'PUSH_UP_GENERIC', // Holding In Down Phase Of Push-up
  '19189e1a-aef2-4924-9e8c-ee84c84ed434': 'HOLLOW_ROCK', // Hollow Body Hold
  'd6c70064-bb1e-510a-9b7a-c6bfc910bfd3': 'HOLLOW_ROCK', // Hollow Rock
  '57512f6d-595f-47a5-ba01-9a8e8dfca5a6': 'HIGH_KNEES', // Hopping High Knee Tap
  '58a8023c-337e-5e94-b8ee-5ebd1d9b3a96': 'FLUTTER_KICKS', // Horizontal Scissor Kicks
  '0e7f5230-165a-5dd9-93c6-34192feb1b50': 'TRAVELLING_PRESS_UP_WALK_OUT', // Inchworm Push-Up
  '10544e2e-3765-1ba9-b753-c9ccd60b06d4': 'INCLINE_BARBELL_BENCH_PRESS', // Incline Barbell Bench Press
  'ce0a9a1a-5650-4f81-949f-78494cec69f7': 'SKULL_CRUSHER', // Incline Barbell Triceps Extension
  'fefbedf9-85f3-e418-eeae-4654e6cfbbfd': 'INCLINE_CABLE_FLY', // Incline Bench Cable Fly
  '49297ec3-9ee7-444c-b83f-74be529eda62': 'BENT_OVER_DUMBBELL_ROW', // Incline Bench Dumbbell Wide Row
  '2b86d658-a0cb-43ce-b782-77e927d3e72c': 'LEG_RAISE_GENERIC', // Incline Bench Leg Raises
  '9f9696a4-6a32-43b7-964e-0c8176bc971a': 'CABLE_BICEPS_CURL', // Incline Cable Curl
  'ae74e375-7d6c-41d6-9e1c-3441ab97bca2': 'CHEST_SUPPORTED_ROW', // Incline Chest Supported Barbell Row
  '2e084eac-88a9-4dfa-bb48-594966e87f7b': 'INCLINE_PUSH_UP', // Incline Close Grip Push-Up
  '61505ee2-7f37-fb06-2519-db3b9f20087d': 'INCLINE_DUMBBELL_BENCH_PRESS', // Incline Dumbbell Bench Press
  '80fd9286-0d64-becd-c2c2-83742b0c3974': 'INCLINE_DUMBBELL_FLYE', // Incline Dumbbell Chest Fly
  'dbfc5012-170f-4db0-8b14-bc44f41c4da8': 'OVERHEAD_DUMBBELL_TRICEPS_EXTENSION', // Incline Dumbbell Triceps Extension
  '9dc6f0a7-0d13-4cdd-b511-fded663e0af1': 'MACHINE_INCLINE_CHEST_PRESS', // Incline Hammer Chest Press
  '6f75f48b-6a78-4882-b193-20e1e63f1df8': 'NEUTRAL_GRIP_DUMBBELL_INCLINE_BENCH_PRESS', // Incline Neutral Grip Dumbbell Press
  '84cbac23-7756-4eb3-9363-cbb2f6347d8a': 'LATERAL_RAISE_GENERIC', // Incline Powell Raise
  'f43ad48c-6c21-4ab2-aa49-ee500c62355c': 'INCLINE_PUSH_UP', // Incline Push-Up
  '76623fa9-5a18-4819-8412-a286f0846ae2': 'SIT_UP_GENERIC', // Incline Twisting Sit Up
  'bb084797-5b76-4f77-98cf-0e4019b3536f': 'INVERTED_ROW', // Inverted Row
  'e29321c6-7817-48a4-b1af-1cec66a5adb3': 'SHRUG_GENERIC', // Inverted Shrug
  '4064a031-fc6e-487b-9e53-8b6c3784cfb4': 'MACHINE_SEATED_ROW', // Iso-Lateral Low Row
  '23d0b626-14b7-4114-82d6-44e25eb5c551': 'PUSH_UP_GENERIC', // Jack Push-Up
  'c7b3f81d-816a-4a45-a2e4-c819f4da0ea8': 'SIT_UP_GENERIC', // Janda Sit Up
  'e0a530e6-e194-45dd-9d0e-e5334a6e5d32': 'DEADLIFT_GENERIC', // Jefferson Curl
  'c9d4e1de-590e-41de-914c-df073d3f4660': 'JM_PRESS', // JM Press
  'a22cee2f-c164-41d3-b0df-b147017edb46': 'JM_PRESS', // JM Press on Smith
  '0460981f-856c-5a68-8214-654ee4ebfcd9': 'RUNNING', // Jogging in Place
  '4479b851-d92c-4da6-b9b2-885f86680832': 'JUMP_ROPE', // Jump Rope
  'd8735b83-7498-47a4-a938-98220e625f71': 'BODY_WEIGHT_JUMP_SQUAT', // Jump Squat
  'eb12bb10-e1b0-4480-8002-941cec163ade': 'PLYO_GENERIC', // Jump With DB
  'bffdb15f-d630-44a1-9a20-d4dc864d6972': 'JUMPING_JACKS', // Jumping Jacks
  'fd5e5506-224a-570a-b059-bda7458fef4a': 'ALTERNATING_JUMP_LUNGE', // Jumping Lunge
  '9a5be8c6-af17-4585-8617-7f54f6088f01': 'BARBELL_PARTIAL_GLUTE_BRIDGE', // KAS Glute Bridge
  'ba9e150f-19c0-46d6-a1f1-37b884fb5827': 'TRICEPS_EXTENSION_GENERIC', // Katana Triceps Extension
  '3c8b1675-4705-4572-9855-3ee077946aa3': 'KETTLEBELL_HALO', // Kettlebell Around the Head Rotation
  'bbf624ab-4d11-497c-98ae-e68484a666bb': 'KETTLEBELL_BICEPS_CURL', // Kettlebell Biceps Curl
  '91c1d821-bfc9-480e-8aac-7a290587388d': 'KETTLEBELL_CLEAN', // Kettlebell Clean
  '74f431ee-7721-4f2e-808b-2c8bd51dc916': 'CLEAN_AND_JERK', // Kettlebell Clean and Jerk
  '9a7407e7-2e8f-41dc-b5f9-5690124b0ed2': 'KETTLEBELL_DEADLIFT', // Kettlebell Deadlift
  'c066f0d4-d8a3-4b0b-8abd-2112c600543b': 'GOBLET_SQUAT', // Kettlebell Goblet Squat
  '7d897425-d1a0-5f4d-b7eb-23bcd132eeb6': 'GORILLA_ROW', // Kettlebell Gorilla Row
  'a1b16209-fba0-43f3-9ac1-d160bcca419a': 'BENCH_PRESS_GENERIC', // Kettlebell One Arm Floor Press
  '7f462663-6e61-4769-b6e7-348881f9965d': 'REVERSE_LUNGE', // Kettlebell Rear Lunge
  'b17fec92-bc5f-480d-912b-988a936065b3': 'RENEGADE_ROW', // Kettlebell Renegade Row
  '9a752d62-bd94-5a76-965a-cd954107bdca': 'SINGLE_ARM_KETTLEBELL_SNATCH', // Kettlebell Snatch
  'ab607a30-8074-4b48-81a9-1ea4cec26a5a': 'SINGLE_ARM_KETTLEBELL_SNATCH', // Kettlebell Snatch
  'a457f1e5-43be-459c-8ff4-506218d01411': 'KETTLEBELL_SWING', // Kettlebell Swing
  'effc2800-2625-404d-8a56-3c42c67fa439': 'KETTLEBELL_WINDMILL', // Kettlebell Windmill
  '75f8962c-e6d5-43d3-be0f-aa9b7ba645d6': 'CARDIO_GENERIC', // Kickboxing
  '269cdd48-8c88-44c8-8c76-b6f2123131d0': 'MODIFIED_PUSH_UP', // Knee Close Grip Push-Up
  'e367af44-824f-4bb4-aca4-ec43ec8ce2dd': 'MODIFIED_PUSH_UP', // Knee Diamond Push-Up
  'e32b37fd-0bbd-4f6d-aa80-a3351bc01ffe': 'MODIFIED_PUSH_UP', // Knee Push-Up
  '8eeb3700-043a-401e-969e-f9d735aba6ed': 'AB_CRUNCH_MACHINE', // Knee Raise Ab Coaster
  '24c4eb14-d625-4ade-bc50-06e096df5e34': 'STRETCH', // Knee To Chest Stretch
  '02e00a0a-3cfc-445d-98b5-04a40b4ed741': 'CRUNCH', // Knee Tuck Crunch
  '78a5c836-05ea-496a-80f5-382bf6405b91': 'THORACIC_ROTATION', // Kneeling Back Rotation Stretch
  '56e8e606-ddaa-48e9-98b5-1216ddf751ce': 'CRUNCH', // Kneeling Band Abs Crunches
  'ef7a226a-8ebe-4ed3-b712-33a548503195': 'CABLE_CRUNCH', // Kneeling Cable Abs Crunches
  'd1109e24-4610-4f9f-93b7-a37691e123bf': 'LAT_PULLDOWN', // Kneeling Cable Lat Pulldown
  '320b01fe-acda-4f6b-a510-646506eecc29': 'CABLE_WOODCHOP', // Kneeling Cable Woodchop
  'd5b46a95-9ed5-418d-b48e-cdea52e602b4': 'STRETCH', // Kneeling Chest Opener
  'dc912b16-ab4f-4e66-abdf-a9a07234e2a9': 'STRETCH', // Kneeling Hamstring Stretch
  '767a6855-3d88-53d9-b067-8eef6e79b2fa': 'KNEELING_HIP_FLEXOR_STRETCH', // Kneeling Hip Flexor Stretch
  'be9d6252-e2d7-5989-bdaa-8482ec0652f4': 'HIP_THRUST', // Kneeling Hip Thrust
  'b4fb2050-cfe0-5d40-8a3f-1120d808def0': 'LAT_STRETCH', // Kneeling Lat Stretch
  '96601f20-dd6e-5045-8170-e34703a5b953': 'PLANK_GENERIC', // Kneeling Plank
  '0c179dee-0e67-473f-84ce-02a48a1e0513': 'DONKEY_KICKS', // Kneeling Resistance Band Glute Kickback
  '70a233fc-676d-41bf-9d12-17acba3e004e': 'PUSH_UP_GENERIC', // Kneeling Ring Push-Up
  'c1218a68-7bd6-4e47-9b9e-159dfab75ad5': 'MODIFIED_PUSH_UP', // Kneeling Wide Push-Up
  '20995c61-3541-47c8-be8d-e1db17c6bffc': 'PUSH_UP_GENERIC', // Knuckle Push-Up
  '15c51d26-076f-4ceb-8702-c15fdf3cb937': 'BODY_WEIGHT_DIP', // Korean Dip
  '6683712d-bac9-4c1d-907d-d2df12e60ee1': 'PULL_UP_GENERIC', // L Pull-Up
  '0d4721f5-3941-4356-9666-4f210bb6b314': 'CORE_GENERIC', // L-Sit
  '9210b5f1-1d2a-47b7-9d04-0e310c4451a6': 'DOUBLE_ARM_CLEAN_AND_PRESS_BARBELL', // Landmine clean and press
  '9a222d45-d75c-4f48-9542-e97f8fd15833': 'LATERAL_RAISE_GENERIC', // Landmine Lateral Raise
  '2e1d20b4-bdd4-4dbf-a2f6-45007e2f5668': 'SHOULDER_STABILITY_GENERIC', // Landmine powell raise
  'cec88e72-629e-5fc3-8b43-5a0788ddeee2': 'BARBELL_ROMANIAN_DEADLIFT', // Landmine Romanian Deadlift
  '9f0b1b6e-42e5-41a9-a210-2e324d4477dc': 'SQUAT_GENERIC', // Landmine Squat
  'd0f8718c-b950-4960-80a5-cc057c225b84': 'CHOP_GENERIC', // Landmine Twist
  'f9820b37-eeb2-5b40-9ee8-d5f399609ca1': 'SHOULDER_PRESS_GENERIC', // Landmine Viking Press
  'a0ef5e32-d928-45e1-b507-71bdaa06bf4c': 'LAT_PULLDOWN', // Lat Pulldown Machine
  '5d55c80e-8375-51b8-86b5-47c11a26722f': 'LATERAL_LEAP_AND_HOP', // Lateral Hops
  'c6028e5a-3df6-4a4d-b11b-13812ad4436f': 'LATERAL_WALKS_WITH_BAND_AT_ANKLES', // Lateral Monster Walk
  'a37b3ea5-7872-5236-95bd-5fabe192f7d4': 'CARDIO_GENERIC', // Lateral Shuffle
  '332334b6-3d1e-4eec-be3b-3fcf6b297ca7': 'LATERAL_RAISE_GENERIC', // Lateral to Front Raise
  '9de5f78f-fb0b-4bba-b42b-852a00388e9c': 'PLANK_GENERIC', // Lean Planche
  'badf5b19-a932-4d33-9618-467ff540f9c9': 'CABLE_LATERAL_RAISE', // Lean-Away Cable Lateral Raise
  '4506c08e-e4bc-453f-8018-fa1c44037aff': 'STANDING_LEG_CIRCLES', // Leg Circles
  '0fb71315-b620-4bef-8192-3ccae70dfa5b': 'LEG_RAISE_GENERIC', // Leg In and Out
  'e17ca855-8185-fbc6-bb54-ab9c4334f0f7': 'LEG_PRESS', // Leg Press
  '38577caa-6c93-4a6f-bb44-57a8b7f92de9': 'MACHINE_LEG_PRESS', // Leg Press Wide Stance
  '2f4d0681-8859-4795-9266-4028c6e0171f': 'FORWARD_AND_BACKWARD_LEG_SWINGS', // Leg Swings
  'c6fffa71-d76e-44b7-bc35-1aa2a90bdc69': 'MACHINE_BACK_EXTENSION', // Lever Back Extension
  'b9b09cef-24a9-103d-0981-ba6076dd0bb6': 'MACHINE_ISOLATERAL_HIGH_ROW', // Lever High Row
  'ccc8321a-3db5-40a3-b687-0cb47f4ee2c9': 'MACHINE_LEG_PRESS', // Lever Horizontal Leg Press
  '70b49da7-8fba-4c5e-bdf2-6035e72a2411': 'MACHINE_SEATED_ROW', // Lever Low Row
  '29e65c0c-5a3f-48e8-b423-cdbe9fef77fa': 'MACHINE_SEATED_SHOULDER_PRESS', // Lever Seated Hammer Grip Shoulder Press
  'ae567a85-61b5-4329-a26f-3b1894e59f6d': 'WARM_UP_GENERIC', // Lizard Pose
  'c650d243-6185-5039-b6b8-823c88c9c406': 'DOUBLE_ARM_CLEAN_AND_PRESS_BARBELL', // Log Clean and Press
  '73c0dbf1-e119-5133-8f67-13603d2ca89c': 'WARM_UP_GENERIC', // Lotus Pose
  '5170255c-cc48-41b6-9b26-a72669deab44': 'PALLOF_PRESS', // Low Cable Horizontal Pallof Press
  '18d649a8-769d-4722-837f-556903fe81ba': 'BENCH_PRESS_GENERIC', // Low Cable Incline Bench Press
  '30fcbd6b-3369-4772-bcfa-05d9b7d52be5': 'INCLINE_DUMBBELL_FLYE', // Low Incline Dumbbell Fly
  'e5ada84d-4df0-4f12-ae4c-ec5dcd51d8b8': 'LOW_CABLE_FLY_CROSSOVERS', // Low-to-High Cable Fly
  '21d66377-bf72-4789-a246-c2e721e7d55c': 'BARBELL_BACK_SQUAT', // Lowbar Squat
  '8e3205f7-4054-4075-ad0b-c4e7d3f986b6': 'HYPEREXTENSION_GENERIC', // Lower Back With A Plate
  'ae0322ff-7913-4410-b8fb-4da942ec4783': 'LATERAL_RAISE_GENERIC', // Lu Raises
  '4a5f1411-75cd-4485-bbcb-d408f76f0a93': 'KNEELING_HIP_FLEXOR_STRETCH', // Lunge Stretch
  'ed99f5c6-76b9-4d8b-9b29-e7e0ae3a6eb8': 'LUNGE_GENERIC', // Lunges
  '44cde330-b5c8-1792-add2-adadcd806b55': 'SKULL_CRUSHER', // Lying Barbell Triceps Extension
  '1fcb8c2c-1f5c-4623-91b4-5f2f946ade06': 'WARM_UP_GENERIC', // Lying Butterfly Pose
  '38edb967-b65d-4c18-854e-5788d0f44bac': 'CABLE_BICEPS_CURL', // Lying Cable Biceps Curl
  '46527a53-629e-4e6c-b4f4-986143756493': 'FACE_PULL', // Lying Cable Face Pull
  '8611358c-7253-0ade-e174-1eb8dfa6ee86': 'FLYE_GENERIC', // Lying Cable Fly
  '44da1d3b-8a67-4e9a-8a5a-15cbb269060e': 'SKULL_CRUSHER', // Lying Cable Skull Crusher
  'af8dd3b8-63db-419d-9d80-ffb64e403898': 'MACHINE_CHEST_PRESS', // Lying Chest Press
  '720a8f79-75aa-4d96-ae21-e94b863d7990': 'CABLE_CROSSOVER', // Lying Cross Lateral Cable Fly
  '27433624-9149-4eba-b527-9314b99d8a2c': 'SKULL_CRUSHER', // Lying EZ-Bar Triceps Extension
  'fedcb18a-d6f3-51a3-9928-7c699dfed080': 'LYING_PIRIFORMIS_STRETCH', // Lying Figure 4 Stretch
  '998e63e1-f6ec-4dae-a7b7-592d74954216': 'STRETCH', // Lying Knee To Chest Stretch
  '279742a1-3b38-489d-adf0-37a9290271d7': 'SIDE_LYING_QUAD_STRETCH', // Lying Quadriceps Stretch
  'c088bc9d-94ff-46ef-9f61-110a605c49d9': 'LYING_SPINAL_TWIST', // Lying Spinal Twist
  '57ffa56b-3279-4b97-b660-5bd91ff26f1f': 'LYING_STRAIGHT_LEG_RAISE', // Lying Straight Leg Raise
  '7c11a58e-cfd0-4bc6-9432-957dee9c0be3': 'LEG_RAISE_GENERIC', // Lying Vertical Scissors
  '477cf52e-038d-55b2-9997-0df950ed2cb8': 'CORE_GENERIC', // Lying Windshield Wipers
  '431ad34e-e714-4ef2-9f2f-b629359da2ff': 'AB_CRUNCH_MACHINE', // Machine Abdominal Crunches
  '23d2096a-5a0c-41d7-adc2-698c8e8c60e2': 'BELT_SQUAT', // Machine Belt Squat
  '8abe4e5f-c746-4112-b6c7-33d1ec688256': 'MACHINE_BICEP_CURL', // Machine Biceps Curl
  'c33a0ac1-5d07-d66c-fc7c-8360786726da': 'MACHINE_CALF_PRESS', // Machine Calf Raises
  'd62736b5-9f97-39cd-7596-1189d05863e9': 'MACHINE_CHEST_FLY', // Machine Chest Fly
  '81112d74-4711-4ddc-9145-a610bf8407c8': 'MACHINE_CHEST_PRESS', // Machine Chest Press
  'd04e4922-8aec-4584-9657-ceda935dc57e': 'MACHINE_CHEST_PRESS', // Machine Chest Press Hammer Grip
  'a16563ca-17e5-51d8-adb7-5c014f0f99be': 'CALF_RAISE_GENERIC', // Machine Donkey Calf Raise
  '8ae59cb6-8a70-4eb6-b2b3-35abe8060f0f': 'MACHINE_HACK_SQUAT', // Machine Hack Squat
  'eda6e2d1-4c13-43c3-b97c-bc22f5db2687': 'CURL_GENERIC', // Machine Hand Grip
  'd61ba24e-4c00-4c61-9127-08db49a79c32': 'MACHINE_HIP_THRUST', // Machine Hip Thrust
  'e8e7d283-5748-9f5d-7fb6-c25feb431c96': 'LATERAL_RAISE_GENERIC', // Machine Lateral Raise
  '591883dc-8fce-4307-a13c-a767d15dcab8': 'AB_CRUNCH_MACHINE', // Machine Lying Crunch
  'f4a9afdd-ffc5-4eeb-ab69-81b8485e5282': 'PREACHER_CURL_MACHINE', // Machine Preacher Curl
  '4ba860b1-2e76-45b6-8023-c386bc56e65d': 'MACHINE_PULLOVER', // Machine Pullover
  '5ee2a3f3-0b7a-7527-b3ee-d7d87664862b': 'MACHINE_REAR_DELT_REVERSE_FLY', // Machine Reverse Flyes
  'a560bb3a-883e-444e-9a2d-bfddbfa457fc': 'MACHINE_HACK_SQUAT', // Machine Reverse Hack Squat
  '7fb3f295-f930-59b6-afe1-9a034fc8adb3': 'REVERSE_HYPER', // Machine Reverse Hyperextension
  '6b0ffef6-8dd1-4b89-999a-a11d85d9e16f': 'MACHINE_SEATED_SHOULDER_PRESS', // Machine Shoulder Press
  '2e701c8a-581a-4505-b4ba-c906102609e0': 'SHRUG_GENERIC', // Machine Shrugs
  '978b4e26-5150-4545-afb9-f61d2d6b1be9': 'MACHINE_TRICEP_EXTENSION', // Machine Triceps Extension
  'd08b7b3a-6473-526c-820b-42394bd17287': 'PLYO_GENERIC', // Medicine Ball Rotational Throw
  '31e7bf28-4c5d-4833-ae1f-069bcb913bbc': 'RUSSIAN_TWIST', // Medicine Ball Russian Twist
  '4ff906b4-b05c-4e2b-b20b-b55d2a60321a': 'MEDICINE_BALL_SLAM', // Medicine Ball Slam
  '2b9833cf-064b-4d42-815b-89c58352179a': 'GLUTE_BRIDGE', // Mini Band Glute Bridge
  'f4466fd4-4d96-5dc5-b877-bff653cc9e5b': 'HIP_THRUST', // Mini Band Hip Thrust
  '741a7466-96b2-4538-af13-15f45eed1ab7': 'MOUNTAIN_CLIMBER', // Mountain climber
  'e3f09a64-c263-4a2a-9253-556db112197d': 'MOUNTAIN_CLIMBER', // Mountain Climbers
  'a0599d91-9d01-5324-8525-f7c3522a32fb': 'MUSCLE_CLEAN', // Muscle Clean
  'c7bc7acf-63e9-4749-a0e1-d130d759ed1d': 'MUSCLE_UP', // Muscle-up
  'd41e66cc-4fff-4bd0-a15f-c83b2921c1b4': 'RING_ROW', // Narrow Grip Australian Pull-Up With Rings
  '786ec1c2-b59a-474a-ab85-e3738a583b42': 'PULL_UP_GENERIC', // Narrow grip pull-ups with weights
  'fbb69c36-f15a-4f0a-ac59-6684df8633fa': 'NEUTRAL_GRIP_PULL_UP', // Narrow parallel grip pull-up
  '084947cf-098f-62f2-36b2-41547577e2b8': 'MACHINE_LEG_PRESS', // Narrow Stance 45 Degree Leg Press
  '8ce2c948-a992-4ce9-b562-2e0ff86679c7': 'TOTAL_BODY_GENERIC', // Neck Curl
  '291593e2-7736-4028-9bf2-77192645930b': 'NECK_TILTS', // Neck Side Stretch
  '80d80656-4acb-4a8a-884a-18af6d7273cc': 'MUSCLE_UP', // Negative Muscle Up
  'f904b1f5-72a6-4f15-a37e-abba285cc604': 'NEGATIVE_PULL_UP', // Negative Pull-Up
  '5f734d43-2eda-4fff-9399-f99a195b6ab3': 'PUSH_UP_GENERIC', // Negative Push-Up
  '0439768d-4b9d-49d1-9388-76987f0ee6db': 'NEUTRAL_GRIP_PULL_UP', // Neutral Grip Weighted Pull-Up
  '71f484d7-0e4d-4251-9000-85b2f1e51435': 'NEUTRAL_GRIP_PULL_UP', // Neutral-Grip Pull-Up
  '3be9dd6e-2749-aa93-a291-4cc48ad59b28': 'NORDIC_CURL', // Nordic Hamstring Curl
  '8d057980-0ca6-4ffd-978e-1e0174d70ebe': 'DUMBBELL_REAR_DELT_FLY', // Odwodzenie ramion w tył na ławce
  '6f9c1398-a069-4318-92b1-7233ff9f0fe7': 'SINGLE_ARM_LAT_PULLDOWN', // One-Arm Band Kneeling Lat Pulldown
  '8a18f1cb-5ada-4456-8957-7eafa50d731d': 'CABLE_REAR_DELT_FLY', // One-Arm Cable Bent Over Lateral Raise
  '4ad95020-4064-49c7-9048-b4f69f1f36bc': 'CABLE_BICEPS_CURL', // One-Arm Cable Biceps Curl
  '51cf698f-c598-4ac3-aa5f-d397fe4e4d69': 'TRICEPS_EXTENSION_GENERIC', // One-Arm Cable Cross Body Triceps Extension
  '229f5259-a671-48c4-acd0-dd109e3744ab': 'FLYE_GENERIC', // One-Arm Cable Fly
  '20afacad-4d93-423b-8d48-7fd05134b702': 'FRONT_RAISE', // One-Arm Cable Front Raise
  '6f1920ff-322b-43c3-8f4f-901be5cd3679': 'SINGLE_ARM_LAT_PULLDOWN', // One-Arm Cable Half-Kneeling Lat Pulldown
  'ed6f4b1d-e657-4a9d-993c-d06254b600e0': 'SINGLE_ARM_LAT_PULLDOWN', // One-Arm Cable Half-Kneeling Lat Pulldown
  '0ea2687b-5d78-4041-8ad4-66a6a8848da1': 'CABLE_LATERAL_RAISE', // One-Arm Cable Lateral Raise
  '9532a115-3b01-43cf-96bb-f8c07cee7089': 'CABLE_LATERAL_RAISE', // One-Arm Cable Lateral Raise
  '138862a9-3d34-4aa7-86f0-13e35d16e12f': 'SEATED_CABLE_ROW', // One-Arm Cable Low Row
  'f6793159-6429-4e35-9b22-13b428ebd903': 'CABLE_SINGLE_ARM_TRICEPS_PUSHDOWN', // One-Arm Cable Pushdown
  'e3a29945-88d3-4cb1-83b6-955074911dc4': 'CABLE_REAR_DELT_FLY', // One-Arm Cable Rear Delt Fly
  'b91720be-c6a9-4b87-b264-0e09f7e9053d': 'SEATED_CABLE_ROW', // One-Arm Cable Row
  'a1569ae6-b56a-4769-bee6-682c7d17a110': 'CABLE_SINGLE_ARM_TRICEPS_PUSHDOWN', // One-Arm Cable Triceps Pushdown
  '245a9e25-296f-4330-9fb6-82de62ebfaca': 'MACHINE_SINGLE_ARM_SEATED_ROW', // One-Arm Chest Supported Row Machine
  'bc2e032c-f9a5-4e27-8b29-b7b80bebcd97': 'SINGLE_ARM_DUMBBELL_BENCH_PRESS', // One-Arm Dumbbell Bench Press
  '081d6aee-e878-4d7e-adda-925768ebf2bc': 'DUMBBELL_ROW', // One-Arm Dumbbell Bent Over Scapula Row
  '7be164bf-92d9-4808-bbf4-2aa207d17205': 'INCLINE_DUMBBELL_BENCH_PRESS', // One-Arm Dumbbell Incline Bench Press
  'aa23e750-8055-4c34-9775-6548001cfc3e': 'LATERAL_RAISE_GENERIC', // One-Arm Dumbbell Incline Lateral Raise
  'bd7b2836-8bd5-4dd6-8645-2bad2da1c2db': 'LATERAL_RAISE_GENERIC', // One-Arm Dumbbell Lateral Raise
  'e2e39ddc-24bd-2a3a-c3a7-aaa34ee19367': 'CURL_GENERIC', // One-Arm Dumbbell Preacher Curl
  'f3410c98-ed27-4d72-a198-651f70330c20': 'DUMBBELL_REVERSE_WRIST_CURL', // One-Arm Dumbbell Reverse Wrist Curl
  '7829c099-6ac4-4eb6-81a4-f6f182f0eafa': 'DUMBBELL_KICKBACK', // One-Arm Dumbbell Seated Kickback
  '2c5c5e94-5091-4615-820e-ded247f917d6': 'CURL_GENERIC', // One-Arm Dumbbell Supination
  '9e7623dc-d10b-4816-a0f5-810a372a4e6a': 'DUMBBELL_REAR_DELT_FLY', // One-Arm Dumbbell Supported Bent Over Lateral Raise
  'b343e608-5d5f-4983-adba-b2045467c73d': 'CABLE_HAMMER_CURL', // One-Arm Hammer Cable Curl
  '86229a51-11aa-4610-9d34-f27e2b4b7eea': 'ROW_GENERIC', // One-Arm High Row Cable
  '8c26f0f1-7a4a-4174-be6c-eab991b25992': 'CABLE_CROSSOVER', // One-Arm High-to-Low Cable Fly
  '427c150b-3c0d-4010-9476-0787cfc84514': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // One-Arm Katana Triceps Overhead Extension
  'c64c25ff-7e50-422e-ba86-ac7e24ddf6e5': 'STANDING_SINGLE_ARM_SHOULDER_PRESS', // One-Arm Kettlebell Overhead Press
  'f5d19b6b-fb4a-5900-8993-8beb19a3a794': 'PUSH_PRESS', // One-Arm Kettlebell Push Press
  '5b2ee265-06ea-46a9-8011-a1e875e8eb64': 'SINGLE_ARM_KETTLEBELL_SWING', // One-Arm Kettlebell Swing
  '6b58e142-6ce7-4492-ac4f-197bd74ab148': 'LANDMINE_ROW', // One-Arm Landmine Bent Over Row
  'd1da7f1a-1aa7-4798-9a0d-a4eccf36ff5f': 'SHOULDER_PRESS_GENERIC', // One-Arm Landmine Half Kneeling Shoulder Press
  'd447c943-d6c5-488d-add7-a317b6855141': 'SHOULDER_PRESS_GENERIC', // One-Arm Landmine Kneeling Shoulder Press
  '603caf54-423d-4715-89ac-d1b4b499107a': 'SHOULDER_PRESS_GENERIC', // One-Arm Landmine Standing Shoulder Press
  '04035dba-efc3-4736-9b1b-bc4fd23d9695': 'SINGLE_ARM_LAT_PULLDOWN', // One-Arm Lat Pulldown
  'eec04e96-7634-4586-8a5b-c5f333bdac6a': 'MACHINE_ISOLATERAL_HIGH_ROW', // One-Arm Lever High Row
  '272ee53c-baf9-4a84-a909-e7370543dd8a': 'SEATED_CABLE_ROW', // One-Arm Low Cable Seated Row
  '98efaa2c-9150-477d-9d20-ae9ae6428fdd': 'CURL_GENERIC', // One-Arm Low Cable Wrist Curl
  '418cf18f-68ac-4314-a2bd-036487e78a2e': 'DUMBBELL_FLYE', // One-Arm Low Fly Dumbbell
  'cd126272-b650-475e-bd59-f58ebb1ad6f6': 'LOW_CABLE_FLY_CROSSOVERS', // One-Arm Low-to-High Cable Fly
  '2b8538c5-03b4-4f4f-b178-11dd9b8ad4f3': 'PREACHER_CURL_MACHINE', // One-Arm Machine Preacher Curl
  '09aed7e3-7a9c-4e38-81a6-bb7675692cbf': 'DUMBBELL_HAMMER_CURL', // One-Arm Neutral Wrist Dumbbell Curl
  'f8ac9f43-116f-79ca-778a-76137bfe61da': 'OVERHEAD_DUMBBELL_TRICEPS_EXTENSION', // One-Arm Overhead Triceps Extension
  '77542def-76bd-40e3-a5af-4340f0672611': 'DUMBBELL_HAMMER_CURL', // One-Arm Preacher Hammer Curl
  '7e9470ae-7936-55cd-b283-7d91f3d901eb': 'PULL_UP_GENERIC', // One-Arm Pull-Up
  '32e2dcf3-923f-4aea-a276-a4c2f9236d43': 'ONE_ARM_PUSH_UP', // One-Arm Push-Up
  '876b0346-eb4e-4ca7-beda-b5825c8e622d': 'MACHINE_REAR_DELT_REVERSE_FLY', // One-Arm Rear Delt Fly
  '6d64b5dc-526f-40aa-ae4b-64fa40a41047': 'CABLE_SINGLE_ARM_TRICEPS_PUSHDOWN', // One-Arm Reverse Grip Triceps Cable Pushdown
  'd8e77fb2-ebb1-4e7c-8e93-fd397a8c290b': 'MACHINE_SINGLE_ARM_SEATED_ROW', // One-Arm Seated Row
  '1bf3fec3-3ec8-48b8-bb5c-7439876c7aab': 'STANDING_SINGLE_ARM_SHOULDER_PRESS', // One-Arm Shoulder Press Dumbbell
  '2340824d-e207-4561-bdcd-8752070c06da': 'STRAIGHT_ARM_PULLDOWN', // One-Arm Straight-Arm Cable Lat Pulldown
  '6e2c5d5f-0653-497d-a8a8-938d4a667686': 'CABLE_SINGLE_ARM_TRICEPS_PUSHDOWN', // One-Arm Triceps Cable Pushdown
  '6a067049-f27b-4c44-93b1-d1a59a4d993d': 'PULL_UP_GENERIC', // One-Arm Weighted Pull-Up
  'f925c8fd-1e75-4a4e-be46-85ed1a2406ed': 'DUMBBELL_WRIST_CURL', // One-Arm Wrist Curl
  '12b4858c-6c84-43b4-964d-cfd590ff7958': 'DUMBBELL_WRIST_CURL', // One-Arm Wrist Curl Dumbbell
  '094ca76a-f428-5ce4-8905-a45fb0096ac0': 'THORACIC_ROTATION', // Open Book Stretch
  'cfddb90c-e434-43a8-8b05-d8556431d7f1': 'ELBOW_TO_KNEE', // Opposite side elbow to knee
  '93e0998c-d13e-5db3-ba88-981f0a272908': 'SIT_UP_GENERIC', // Otis-Up
  'cb57a584-6e5e-4305-891c-f06140dc8fd5': 'TRICEPS_EXTENSION_GENERIC', // Overhead Band Triceps Extension
  'a46311d5-71d4-4027-8876-c4419b110819': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // Overhead Cable Triceps Extension (Bar)
  '3efa8afc-e9ac-41a7-82af-6dccefc96e33': 'OVERHEAD_TRICEP_STRETCH', // Overhead Triceps Stretch
  '41ffce31-1db6-4b98-9b62-8927dedd3fa6': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // Overhead V-grip tricep extension
  '4d338165-6bc5-4596-a38c-8c8e776ecb71': 'PALLOF_PRESS', // Pallof hold
  '270e4fd5-ce94-54b2-9c5a-bf8f2ca472d8': 'STEP_DOWN', // Patrick Step
  '9c41c62b-d3cd-46ea-b314-080b363d2bdd': 'BARBELL_BACK_SQUAT', // Paused Barbell Squat
  'd5ed232b-87cc-43f8-8e0b-772899358dff': 'PAUSED_BENCH_PRESS', // Paused Bench Press
  'd892e142-f3e2-5df0-8fd4-c5b4d9b8b219': 'PAUSED_BENCH_PRESS', // Paused Bench Press
  '9df0c37c-3b2b-4e75-9d0e-70c42e0f0405': 'BARBELL_DEADLIFT', // Paused Deadlift
  'de5db6cd-faff-513e-a823-75d9d2a5b322': 'BARBELL_BACK_SQUAT', // Paused Squat
  '6548ec6b-8ab8-4866-8b80-e2b412937051': 'PEC_DECK_BUTTERFLY', // Pec Deck Chest Fly
  'bbe9a0d9-509e-4362-b9e9-396e8b7c79c3': 'BENT_OVER_BARBELL_ROW', // Pendlay Row
  'dce12764-2f16-541d-ac75-3b9e7593592a': 'PENDULUM_SQUAT', // Pendulum Squat
  '81a7dd83-e98c-405e-89b6-f9390fa16bb8': 'PIGEON_POSE', // Pigeon Pose
  'b1127a06-b245-4fc2-900d-b9521c454226': 'CRUNCH', // Pike Crunch
  '7a25e368-095f-4d88-9152-a87bd51cec2b': 'HANDSTAND_HOLD', // Pike Hold Handstand
  '7a5662a2-c81d-4d1c-83c3-52441ad8e595': 'PIKE_PUSH_UP', // Pike Push-Up
  '2a9fd936-4875-4004-bea8-6f4f78081174': 'PIKE_PUSH_UP', // Pike Push-Up Between Benches
  '56c729a9-e650-4668-bd71-47eae8fc9efa': 'PIKE_PUSH_UP', // Pike Push-Up Between Chairs
  'e58c666b-518c-488c-bac5-b58b6b1fbb62': 'PIKE_PUSH_UP', // Pike Push-Up On Bench
  'f21e5c77-a3c2-5033-a2cf-7140a880572e': 'THE_HUNDRED', // Pilates Hundred in V Position
  'cbf0e055-72dc-4e3d-bd43-6055b2bd0bed': 'BARBELL_BENCH_PRESS', // Pin Bench Press
  'a62eced5-a72a-4f57-b1b2-5b0e4bf17475': 'BARBELL_FRONT_SQUAT', // Pin Front Squat
  '17325fc8-61c6-4697-9fe1-17e7ece44254': 'BARBELL_BACK_SQUAT', // Pin Squat
  'c2b72e25-1c85-43f3-9c95-5bd9431e34ac': 'PISTOL_SQUAT', // Pistol Box Squat
  '03d73a15-6288-4c26-922f-dfc877f44128': 'PISTOL_SQUAT', // Pistol Squat
  '2d677a46-52c9-4daa-a391-477823fd68e5': 'BODY_WEIGHT_DIP', // Planche Dips
  '492742c2-2f9d-403c-8212-3323acb46df2': 'PUSH_UP_GENERIC', // Planche Push-Up
  '5cd1538c-cc1e-8446-a4eb-70f868eb0005': 'PLANK_HOLD', // Plank
  '44668f91-5797-5ea5-93e9-41f177f30294': 'PLANK_GENERIC', // Plank Alternating Leg Lift
  '59e4971a-720d-4601-b6d5-a5c2f80b5166': 'PLANK_HOLD', // Plank Arms Extended
  'd6b7b5cb-8042-440c-b59f-b860d4461af8': 'PLANK_GENERIC', // Plank hip dips
  '49f10550-f57c-57f1-8558-a18bb7186b9a': 'PLANK_GENERIC', // Plank Hip Dips
  'c4bb8ae6-9419-5e47-9e22-579694215753': 'PLANK_GENERIC', // Plank Jack
  '116528b3-f3f4-5817-903a-aacdadaf2af3': 'PLANK_TO_PUSH_UP', // Plank Up-Down
  '7a4f1acb-f378-4229-8a37-e7f72ae6d3cd': 'SHOULDER_STABILITY_GENERIC', // Plate Bus Driver
  'a651bd8e-9d5d-40be-b1d9-766081a4b34a': 'PLATE_FRONT_RAISE', // Plate Front Raise
  '05047869-eeb1-4c65-948c-0d85715bacae': 'PLATE_FRONT_RAISE', // Plate Front Raise Drive
  '2b3d393a-721d-4995-acba-b68aa6bb05bc': 'KETTLEBELL_HALO', // Plate halo
  '0c9f1303-e00d-55a1-a72c-2f776ffa86cc': 'SQUAT_GENERIC', // Plate Pinch Squat
  'da6b09eb-e55d-42cd-988d-1454658c1a4f': 'MACHINE_CHEST_PRESS', // Plate-Loaded Chest Press
  '0e6340a2-0757-508a-b1c0-a26cb2b75de5': 'MACHINE_SEATED_SHOULDER_PRESS', // Plate-Loaded Shoulder Press
  '9194fcea-dbc9-4db8-b448-96552077dbd1': 'PLYO_GENERIC', // Plyo side lunge
  '451515e3-d9b4-5dce-a20d-504e43c4aecb': 'CLAP_PUSH_UPS', // Plyometric Push-Up
  'be225aec-96d1-4dfb-9670-c9c6ccfddd99': 'POGO_JUMPS', // Pogo Jumps
  'fc730971-57d7-458f-bc9a-6217c728fd83': 'DUMBBELL_FLYE', // Poliquin Flyes
  '55c465c9-b72e-4a61-b8ed-d3f8502e0b79': 'STEP_UP', // Poliquin Step-Up
  'cecca324-fd07-4b8d-90fa-c2347f4f9cb0': 'DECLINE_PUSH_UP', // Pompki Obciążone Z Podwyższeniem Nóg
  'e14931b5-96ce-e1ed-4604-46958f33bd85': 'LATERAL_RAISE_GENERIC', // Powell Raise
  '25157430-0a7c-4079-a00d-51a846790596': 'BARBELL_POWER_CLEAN', // Power Clean
  '6c792bde-98ae-5019-9b83-2355fb9d6c0b': 'PUSH_JERK', // Power Jerk
  '2eea538e-528b-41a9-8aa3-68d2f0255127': 'BARBELL_POWER_SNATCH', // Power Snatch
  'ca1dbb25-9c6d-464b-95ca-a55d9b72395a': 'PREACHER_CURL_MACHINE', // Preacher Hammer Curl
  '7e9b2894-844a-45f1-94a6-84b2c33c860f': 'RESISTANCE_BAND_GENERIC', // Pronator Rotation With Band
  '351194f6-dfcf-4cad-8828-d57f9b84b9d9': 'FROG_PUMP', // prone frog pump (smith)
  '7728c4a9-c47b-5fee-81f1-73f030ecdbbf': 'LAT_PULLDOWN', // Prone Lat Pulldown
  'bdfbf8c4-7d96-f9bd-f441-523c1a434312': 'LEG_CURL_GENERIC', // Prone Lying Leg Curl
  'cf3f728d-6e5e-508d-86f6-61ff09ffbf33': 'SHOULDER_ROTATIONS', // Prone Shoulder CARs
  '73178ef7-4fe8-47df-9cb0-991d33cc66bf': 'SUPERMAN_FROM_FLOOR', // Prone Swimmer
  '4a15c9af-aa84-5726-ae96-8f17101403bf': 'FLOOR_T_RAISE', // Prone T Raise
  'f12bc46c-f96a-59b1-b74d-908da1ed4d9c': 'INCLINE_W_RAISE', // Prone W Raise
  'e563aff5-29f6-5660-92b6-5262040c71ef': 'FLOOR_Y_RAISE', // Prone Y Raise
  '75c7819c-7c7d-4c96-b9c2-aa45e20c4956': 'SLED_PUSH', // Prowler Sled
  '67f6aae7-5674-4e6e-9b39-1e4a0c956e5c': 'CORE_GENERIC', // Pull Around
  '04141712-a8e2-49df-9e46-ba6204ae5edf': 'PULL_UP_GENERIC', // Pull-Up
  '1f0ed45d-5c7d-7d28-1df8-5dac013c1c38': 'WIDE_PULL_UP', // Pull-Up Wide Grip
  '2a1d3932-f562-437a-a7d4-96539dff07a5': 'CARDIO_GENERIC', // Punching Bag Boxing
  '6a602b98-88ce-feb2-ac46-4bc607125fd7': 'PUSH_UP_GENERIC', // Push-Up
  'c9679a7c-9960-4d98-a130-1e919bfe1f74': 'PUSH_UP_GENERIC', // Push-Up on Parallel Bars
  '217f7b05-c64b-5e21-a162-655a86d63d8c': 'PUSH_UP_GENERIC', // Push-Up Plus
  '18215065-ca06-5740-98e1-beeda6f74b96': 'PUSH_UP_GENERIC', // Push-Up to Side Plank
  '4a6141ef-308f-47f6-8930-62ebaa837b6e': 'HYPEREXTENSION_GENERIC', // QL Extension Holds
  'e5cef725-3790-4842-aa23-8701fd26f543': 'CROSS_BODY_SHOULDER_STRETCH', // Rear Deltoid Stretch
  'a832b1f9-ffc0-43e6-80e4-2dea898f0f21': 'REVERSE_LUNGE', // Rear Lunge
  '4d329cfe-30b9-5c95-8fda-e25a9552f21f': 'CARDIO_GENERIC', // Recumbent Bike
  '3ed15c03-1804-4a10-a975-43e21e7cb3d1': 'HIP_STABILITY_GENERIC', // Resistance Band Hip Adduction
  '8b039cb0-a7cb-4ffa-9fa1-e6120abf7936': 'PUSH_UP_GENERIC', // Resistance Band Push-Up
  '9e5c1465-5ec1-40c0-8b50-2dd531666b82': 'REVERSE_CRUNCH', // Reverse Crunches
  'c5e55508-8f59-4c68-a5b5-7f5b2b7df078': 'REVERSE_CABLE_CURLS', // Reverse Grip Cable Curl
  '16e79f27-f9b4-4162-9de2-37fe0dde76d8': 'CABLE_TRICEPS_PUSHDOWN', // Reverse Grip Cable Triceps Pushdown
  'fbf45029-6a73-423f-b6df-c6d494f8c2a9': 'PUSH_UP_GENERIC', // Reverse Hand Push-Up
  'dabbc3d1-7cfc-4031-8224-9836ec7725e6': 'LEG_EXTENSIONS', // Reverse Nordic Curl
  '02ab3c67-1b98-512a-8b30-a3d523cb19e1': 'REVERSE_PLANK', // Reverse Plank
  '26ad508e-4cb5-5541-bccb-dff3d98ae695': 'SHOULDER_STABILITY_GENERIC', // Reverse Snow Angel
  '04bb3bb4-e60d-4122-b1a6-771c2a4a5b59': 'PUSH_UP_GENERIC', // Reverse Wrist Push-Up
  '61d53479-08f4-46e7-bee2-c148f7e885a0': 'RING_PULL_UP', // Ring Chin Up
  '82026f2f-2c3a-4a96-81ec-95cab56fd8fc': 'RING_DIP', // Ring Dips
  '7f6833fb-34c3-4b13-bb42-61b8524a5c09': 'FACE_PULL', // Ring Face Pull
  'f8415c81-7b41-4102-9a98-5fadaabded3d': 'LEG_CURL_GENERIC', // Ring Leg Curl
  '2463cfae-b1dc-4f38-af0a-544002d6fbc2': 'RING_MUSCLE_UP', // Ring Muscle Up
  '5bf96492-da9d-4c59-a664-61f5091dae04': 'CORE_GENERIC', // Ring Pike
  'bc1b689d-6228-43bd-8e9e-d135b1e55807': 'PUSH_UP_GENERIC', // Ring Push-Up
  '471c63b8-b3dd-5d46-8225-8745d9df5f19': 'RING_DIP', // Ring Support Hold
  '47129c4d-735d-42da-897a-6346b2ec80ca': 'TRICEPS_EXTENSION_GENERIC', // Ring Triceps Extension
  '3b9873e3-a9a0-5509-9deb-85efcd9a8fbd': 'PLANK_GENERIC', // Ring Tuck Planche
  '7cb4fd38-5ca9-4d65-a5df-f8a0b3288fbc': 'RING_PULL_UP', // Rings Pull-Up
  'b3e21bcc-e194-4323-a27c-7e960c617bea': 'WARM_UP_GENERIC', // Rocking Frog
  '02be3155-246f-4620-be93-dbd682d3fbca': 'WARM_UP_GENERIC', // Rocking Half Frog Stretch
  'f1afe248-38b7-4489-8991-4d0acc5f4cd2': 'WARM_UP_GENERIC', // Roll Calves
  '3a1fc73a-3f12-43bb-8f88-5e5b0d1443b8': 'WARM_UP_GENERIC', // Roll Foot
  'bde8a221-1dd3-40ec-bf89-b26d8e991b77': 'BARBELL_ROMANIAN_DEADLIFT', // Romanian Deadlift
  'f3bb1cb2-a42a-bb35-4e66-d7389eec88c1': 'CABLE_HAMMER_CURL', // Rope Cable Hammer Curl
  'd341805c-cee6-54e9-8e71-a1d17e22fe80': 'ROPE_CLIMB', // Rope Climb
  '1a9dfa03-6633-4c8e-830e-1c5928b8c0d7': 'STRAIGHT_ARM_PULLDOWN', // Rope Straight-Arm Lat Pulldown
  'fe01e50a-b97c-4bb7-87f2-bed05cfa2445': 'CABLE_TRICEPS_PUSHDOWN', // Rope Triceps Pushdown
  '5d7f0882-cb58-4a57-8a64-9c59fb4f81be': 'CALF_RAISE_GENERIC', // Rotary Calf Raise
  '0ad57432-b306-46f9-a486-635db0a1080c': 'CORE_GENERIC', // Rotary Torso
  'fb024dd3-2708-47fd-bc56-5246984bf50d': 'WARM_UP_GENERIC', // Rotation Inside
  '7ce5e3ff-7276-41cd-8a14-41e33ab76ddc': 'ROWING_MACHINE', // Rowing Machine
  'c4cace30-2da2-501d-9fd0-abda6c8ad7c9': 'CARDIO_GENERIC', // Rucking
  'fb42b833-a9f4-4a13-8e57-78a95dc184c8': 'RUNNING', // Running
  'bc93fb5b-dadd-572c-aa74-9f56138e3f12': 'BARBELL_BACK_SQUAT', // Safety Bar Squat
  '6eb4dcf8-8ba6-42ee-b316-ceba63178cc6': 'CURL_GENERIC', // Sam Sulek Forearms
  'b9d93a09-494b-55c4-8398-4f6a5ce2adbb': 'CARRY_GENERIC', // Sandbag Bear Hug Carry
  '15dfe661-f822-5565-862f-a845b058a86a': 'SANDBAG_LUNGE', // Sandbag Forward Lunge
  'afe0d300-093b-44d2-b258-0d2a431954e4': 'PLANK_GENERIC', // Saw Plank
  '41162b76-a99a-4188-88c3-7fd27abc78ce': 'SERRATUS_SHRUG', // Scapula Push-Up
  '48d72616-f5df-4299-b159-93112687ec01': 'FLUTTER_KICKS', // Scissors
  '58d552cb-55d5-4ffc-b00f-c7b4f8ac11e0': 'EZ_BAR_PREACHER_CURL', // Scott Bench Curl
  '7d2e18b4-47e6-4899-8873-135709ed673a': 'EZ_BAR_PREACHER_CURL', // Scott bicep
  '7e2b3c1c-97db-405e-b9ca-e6ebdc5db673': 'SEAL_ROW', // Seal Row
  'cb4adf67-8fc7-4fee-b077-0971132d0c9a': 'CABLE_CRUNCH', // Seated Ab Cable Crunch
  '26f02fe3-fdeb-4e1d-97d4-5c39f4af9c0b': 'CRUNCH', // Seated Alternate Crunches
  '94c21e20-4a05-866d-b727-5c67cca61b47': 'ARNOLD_PRESS', // Seated Arnold Dumbbell Press
  '38938cf9-f0b8-4894-9393-ce7ed9a4e28e': 'HIP_STABILITY_GENERIC', // Seated Band Hip Abduction
  'f6b447b8-ddb6-a278-8b64-aa5ea715ef82': 'SEATED_BARBELL_PRESS', // Seated Barbell Shoulder Press
  'f840c38e-9b55-493d-9350-eab5a6d67483': 'CORE_GENERIC', // Seated Barbell Twist
  'a95a114d-0ac6-13ac-2650-6442fd9c85af': 'DUMBBELL_REAR_DELT_FLY', // Seated Bent Over Dumbbell Lateral Raise
  'baf42461-446f-423b-aafc-551d90d7f03b': 'CHEST_PRESS', // Seated Cable Chest Press
  'e3c8ed4e-067b-4435-aaed-36c75976bab1': 'SEATED_CABLE_ROW', // Seated Cable Flexion Row
  '6ae119ae-5a82-47d2-b0c1-dc5a0ca91403': 'FLYE_GENERIC', // Seated Cable Fly
  'd59fcd68-dfec-409d-a72b-2be41be7c594': 'CABLE_OVERHEAD_TRICEPS_EXTENSION', // Seated Cable Horizontal French Press
  'c6c9eeca-3ee1-4a8b-b34a-496b35c5dd53': 'SEATED_CABLE_ROW', // Seated Cable Low Row Neutral Grip
  '1a335136-840a-4499-9778-4ddef29a6771': 'SEATED_CABLE_ROW', // Seated Cable Row
  '13a0a404-a40c-4565-b125-29a3c83a2bd6': 'SEATED_CABLE_ROW', // Seated Cable Wide Grip Row
  'd271435e-ad73-4dab-a3a8-3c171781c4a4': 'SEATED_PALMS_UP_WRIST_CURL', // Seated Cable Wrist Curl
  '3f273f1e-db4b-6f02-e083-92cb6227f20a': 'SEATED_CALF_RAISE', // Seated Calf Raise
  '1b12da4f-fdea-458c-a3dc-d630bc297639': 'SHOULDER_PRESS_GENERIC', // Seated Cuban Press
  'ef115bce-70a8-4db5-b917-3e9fc3a89d5c': 'SEATED_DIP_MACHINE', // Seated Dip Machine
  '200cb09a-11e5-4a94-a38f-9e0e2bd0096f': 'STANDING_DUMBBELL_BICEPS_CURL', // Seated Dumbbell Curl
  '12838e78-2632-4e2b-87c9-3926e86a7e1a': 'SEATED_DUMBBELL_LATERAL_RAISE', // Seated Dumbbell Lateral Raise
  '5b2bdea5-ceee-a837-596c-fd2f6138ffff': 'SEATED_DUMBBELL_SHOULDER_PRESS', // Seated Dumbbell Shoulder Press
  '66a6068b-f1aa-40b8-9f56-0359cc0573b1': 'DUMBBELL_SHRUG', // Seated Dumbbell Shrugs
  '3c28f1b2-7cb3-4c6a-9d73-64730de893e6': 'FACE_PULL', // Seated Face Pull
  '4ec535de-1f4a-451a-9dc5-dab2920b51f4': 'LYING_PIRIFORMIS_STRETCH', // Seated Figure 4 Stretch
  'a8c695a1-a954-4b58-8924-ab0689b255c1': 'FLUTTER_KICKS', // Seated Flutter Kick
  'dfc3bc3e-7669-43ae-9462-06084ccc46d0': 'SEATED_HAMSTRING_STRETCH', // Seated Forward Fold
  'ecd73905-fd43-458c-bc6e-288a83dafbb9': 'GOOD_MORNING', // Seated Good Morning
  '769f188b-41a3-40e4-aec4-f5980417e786': 'DUMBBELL_HAMMER_CURL', // Seated Hammer Curl
  'c0d708f6-00ab-118f-9f7d-e13f27e5458b': 'MACHINE_HIP_ABDUCTION', // Seated Hip Abduction
  '142bd4e5-6755-42e2-83ad-cbfcf6388dab': 'MACHINE_HIP_ADDUCTION', // Seated Hip Adduction
  'c6b09de6-cce7-5b30-b0d4-4a787aed07cc': 'HIP_STABILITY_GENERIC', // Seated Hip External Rotation
  'fcba03ad-7517-5739-8dc8-9b20bdc20c13': 'HIP_STABILITY_GENERIC', // Seated Hip Internal Rotation
  'd56a3927-61c7-4b1f-9b49-09310388103a': 'INCLINE_DUMBBELL_BICEPS_CURL', // Seated Incline Biceps Curl
  '91bdce20-29e2-40df-9aa3-7b16adb396d7': 'LEG_RAISE_GENERIC', // Seated Knee Tuck
  '3ae8ee86-534c-0824-07b6-e9f105b97c1d': 'MACHINE_LEG_CURL_SEATED', // Seated Leg Curl
  '8fd1b9d5-ad0c-8fa5-da97-dcb248588ef5': 'MACHINE_LEG_EXTENSION', // Seated Leg Extension Machine
  '8f86a994-5d86-423c-a395-55122f54de34': 'CORE_GENERIC', // Seated Machine Trunk Rotation
  '618813bd-86d3-4bed-9881-5d03342d37ae': 'CRUNCH', // Seated Reverse Circle Crunches
  '77e949b2-df71-4560-b72c-f79eaa7966dc': 'SHOULDER_STABILITY_GENERIC', // Seated Shoulder External Rotation
  'd37cc65e-3c18-4e39-8ea2-200c4f20e348': 'SEATED_DUMBBELL_SHOULDER_PRESS', // Seated Shoulder Press Neutral Grip
  '9202e88a-111c-40f8-8464-d567a7fff830': 'MACHINE_SINGLE_LEG_CURL_SEATED', // Seated Single Leg Curl
  '085df570-92e9-46b5-ad8c-fd6650a4a498': 'SEATED_HAMSTRING_STRETCH', // Seated Single Leg Hamstring Stretch
  '85a857a4-72e3-5915-9dca-abd8f18c6cb1': 'LYING_SPINAL_TWIST', // Seated Spinal Twist
  'db0f3772-abd1-41a9-a2c9-7e0f73fd4fe4': 'STRAIGHT_LEG_RAISE', // Seated Straight Leg Raises
  '7c3c787d-e438-4f50-bde7-cc5843f84fdd': 'BENCH_DIP', // Seated Triceps Bench Dip
  'b31f3da6-b239-41c0-9662-f0a8996868c6': 'PLANK_SHOULDER_TAP', // Shoulder Tap
  '78f3c17f-0146-4bf6-a8f1-a45843f99ba3': 'WARM_UP_GENERIC', // Shoulderstand Pose
  'c67f806c-8017-50d2-aa54-c928b40af06f': 'SQUAT_GENERIC', // Shrimp Squat
  '7040145b-7261-4726-a312-ce966c3490c3': 'SIDE_BEND', // Side Bends
  '9a2d3693-68bc-4d44-852a-fbe16337f521': 'OBLIQUE_CRUNCH', // Side Crunch
  'e0ef2970-5221-4b13-a4e6-b56a0af148f1': 'SIDE_LEG_SWINGS', // Side Leg Swings
  '7cd5b83e-c3b4-4198-9279-01a3a3df4f18': 'SIDE_LUNGE', // Side Lunges
  'fb673a87-e402-4e11-aada-a5a53bf362e8': 'CLAMS', // Side Lying Clams
  '1dde3ef2-f45d-4881-a0e0-dc54b3a70814': 'SHOULDER_STABILITY_GENERIC', // Side Lying External Rotation
  '793e9f35-ce3c-4d2d-87b8-5b6955ac5279': 'SIDE_LYING_LEG_RAISE', // Side Lying Hip Abduction
  'e2e9cb4a-6f11-5f13-8ff3-d54f1799ff1c': 'HIP_STABILITY_GENERIC', // Side Lying Hip Adduction
  'abefa761-e360-4522-b9cb-98982266c699': 'SIDE_LYING_QUAD_STRETCH', // Side Lying Quadriceps Stretch
  'aaed90b1-e560-4b16-8011-494f75522f3a': 'SIDE_PLANK', // Side Plank
  'd559dcb5-b272-4b29-bd65-89ec8615e474': 'SIDE_PLANK', // Side Plank Band Row
  'dc62d95f-c818-41a6-b97a-b035983cd42a': 'PLANK_GENERIC', // Side Plank Clamshell
  '59c152a9-7463-4c6d-888b-4a989399242e': 'SIDE_PLANK_LEG_RAISE', // Side Plank Hip Abduction
  '6887c9df-cac3-4ac8-97d0-ac43406c3816': 'SIDE_PLANK_LEG_RAISE', // Side Plank Hip Abduction
  '63c42486-8bde-5c1a-99a3-83c30c665f20': 'SIDE_PLANK', // Side Plank Hip Raise
  'f45e04d8-a9ef-4481-9e1b-5e763fb0ad72': 'SIDE_PLANK', // Side Plank Twist
  '46873eee-12dd-412d-8ad2-dc040d26b270': 'SINGLE_ARM_CABLE_CHEST_PRESS', // Single Arm High to Low Cable Chest Press
  '26268881-afd6-445d-9a8b-a149d8dafdaa': 'STANDING_DUMBBELL_BICEPS_CURL', // Single Dumbbell Curl
  '291ae6d1-b9c5-4fc4-be0b-446068550a27': 'SLIDING_LEG_CURL', // Single Leg Curl Slide Eccentric
  'd15edf28-16b7-02a1-ef0a-1273df7fbee8': 'SINGLE_LEG_DUMBBELL_ROMANIAN_DEADLIFTS', // Single Leg Dumbbell Deadlift
  '81c28cab-ffcc-44f7-8869-7e0979e5a145': 'SINGLE_LEG_HIP_RAISE', // Single Leg Hip Thrust
  '46b8d3bc-cb2e-463a-9f99-d6e9fe82129d': 'BARBELL_SINGLE_LEG_HIP_THRUST', // Single Leg Landmine Hip Thrust
  '430f3cd3-934c-496d-b4e0-40daceb5c166': 'MACHINE_SINGLE_LEG_PRESS', // Single Leg Press
  '45c3ad61-7849-4169-9f03-de68c12aa4b9': 'SINGLE_LEG_ROMANIAN_DEADLIFTS', // Single Leg Romanian Deadlift
  '6215e01e-da84-4349-8967-2169e082f469': 'SEATED_CALF_RAISE', // Single Leg Seated Calf Machine Raise
  'fa39a858-968d-4c38-ac0b-19c958c9dce6': 'SINGLE_LEG_STANDING_CALF_RAISE', // Single Leg Smith Calf Raise
  'a8a21f5f-86b9-4898-b83f-b3c4bcb79a63': 'SINGLE_LEG_GLUTE_BRIDGE', // Single Leg Weighted Glute Bridge
  'ce8d4c15-8a34-441b-ac87-7b94dc57c220': 'SL_BOX_JUMP', // Single-Leg Box Jump
  'a34aa557-2803-46e5-8737-a6ff91d32045': 'LEG_CURL_GENERIC', // Single-Leg Cable Leg Curl
  '5bd74809-7a6d-4265-80f1-fc20144a7ebb': 'SINGLE_LEG_STANDING_CALF_RAISE', // Single-Leg Calf Raise
  '2187784c-77b0-4106-9b6f-cd5938da82b8': 'SINGLE_LEG_DUMBBELL_STANDING_CALF_RAISE', // Single-Leg Calf Raise with Dumbbell
  '5ba385ff-a1f8-44d4-b3a9-f988d2a3ea75': 'SINGLE_LEG_BARBELL_ROMANIAN_DEADLIFTS', // Single-Leg Deadlift
  'f509cfcd-6baf-4b6e-8210-1bf2b574efa5': 'MACHINE_SINGLE_LEG_QUAD_EXTENSION', // Single-Leg Extension
  'c72d1396-05a3-4254-a62e-dbbba9813472': 'LEG_CURL_GENERIC', // Single-Leg Lying Curl
  'd9710b8d-882f-450b-978a-b342dce66e90': 'SEATED_DUMBBELL_CALF_RAISE', // Single-Leg Seated Calf Raise with Dumbbell
  'e0b04180-2f8c-4af2-b2a1-0204a47e8962': 'LEG_CURL_GENERIC', // Single-Leg Swiss Ball Curl
  'da97618c-f444-4d40-85be-57650abe0ac2': 'SISSY_SQUAT', // Sissy Smith Squat
  'da1122db-5ae7-4a78-be7b-078f92bd5dda': 'SISSY_SQUAT', // Sissy Squat
  '57463e1d-1b6c-49c0-afa9-258a626a5b3b': 'SIT_UP_GENERIC', // Sit Up
  '0e833972-04f5-c0d4-c790-2400bfd748ca': 'RUSSIAN_TWIST', // Sitting Twist
  '808a393a-1e7f-430d-bdbb-be06257f2e9f': 'LATERAL_RAISE_GENERIC', // Six Way Raises
  '8fc0c9c9-e4ee-5914-a2c4-aa07bf00610f': 'LEG_LIFTS', // Six-Inch Hold
  '381071f1-f3c1-546e-8ffb-289d9d416fd9': 'LATERAL_LEAP_AND_HOP', // Skater Jumps
  '0ea14a55-1bbc-5393-aa08-d103432b80cc': 'SQUAT_GENERIC', // Skater Squat
  '8e408345-f873-4f50-82aa-65f99cd78af9': 'SKI_ERG', // Ski Ergometer
  'a759801b-649f-4cf5-929f-ccc57a8ffb56': 'CORE_GENERIC', // Skin The Cat
  '232bc821-2491-513c-8131-7e56007f54d9': 'SLED_PULL', // Sled Drag
  'dfae674f-be51-5c67-ac0f-1422108c01a3': 'SLED_PULL', // Sled Rope Pull
  '7ac50749-f5f6-5047-915d-898510a847ab': 'SLEEPER_STRETCH', // Sleeper Stretch
  '01259ee3-bdff-47c4-b7dc-e5283ea89e01': 'SLIDING_LEG_CURL', // Sliding Leg Curl
  '5d581dce-e35e-45cc-94eb-f9bb8103a455': 'BENCH_PRESS_GENERIC', // Smith Bench Press
  '78659ec5-a814-4734-9e3d-ee3e784b71b3': 'STANDING_CALF_RAISE', // Smith Calf Raises
  'b7ec6aa3-d3da-4b35-974a-c50c7eb08794': 'STANDING_CALF_RAISE', // Smith Calf Raises
  '13cc32dc-dbee-4e85-b1e5-ee7fecdbb845': 'SMITH_MACHINE_SQUAT', // Smith Chair Squat
  'b88ce237-ce60-4b9d-891d-a1d628983960': 'SMITH_MACHINE_SQUAT', // Smith Front Squat
  '61242c0e-4fdf-4e41-a4c8-f94caa17f568': 'SMITH_MACHINE_SQUAT', // Smith Hack Squat
  'efa13a07-2158-4db6-9ebc-6e852ffa2aef': 'SMITH_MACHINE_INCLINE_BENCH_PRESS', // Smith Incline Chest Press
  'a73c52dc-e7cc-4775-8a59-5b2277bf9697': 'HIP_THRUST', // Smith Kneeling Hip Thrust
  'fcbf09e6-539f-4390-8434-d15d982d55d6': 'SMITH_MACHINE_ROW', // Smith Machine Bent Over Row
  '3dbb26db-032a-435d-9e0b-98c587fd4568': 'MACHINE_GLUTE_KICKBACK', // Smith Machine Glute Kickback
  '2d2291cc-8340-4667-80db-becf8e594b1b': 'GOOD_MORNING', // Smith Machine Good Morning
  'eccb443f-5efd-46ae-b522-a4b8a4066ce2': 'ROMANIAN_DEADLIFTS', // Smith Machine Romanian Deadlift
  'c5ca939d-59e8-4130-941e-ace55a33f96a': 'STEP_UP', // Smith Machine Step Ups
  'bbf7d889-640a-4032-ad12-7edceed931d3': 'BARBELL_UPRIGHT_ROW', // Smith Machine Upright Row
  'c49da46d-cb8f-4a5b-b948-94208d9880e5': 'SMITH_MACHINE_LUNGE', // Smith Rear Lunge
  '845e552e-35b7-8fd4-8ecb-6c03874085cd': 'BARBELL_BEHIND_THE_HEAD_SHOULDER_PRESS', // Smith Seated Behind Neck Press
  'a55493ee-d268-48fb-8a06-1d39576058ad': 'SEATED_CALF_RAISE', // Smith Seated Calf Raise
  'ef258e02-3b95-4569-9993-b34fabd06cd0': 'SMITH_MACHINE_OVERHEAD_PRESS', // Smith Shoulder Press
  '759db4cc-b963-4f53-b512-aadcfe301c4f': 'BARBELL_SHRUG', // Smith Shoulder Shrug
  '691ccaf0-29e9-433a-a849-f27b306b9bea': 'BARBELL_SPLIT_SQUAT', // Smith Split Squat
  '4abb70b5-85d7-4650-b5ab-b6e32bb37fd8': 'SMITH_MACHINE_SQUAT', // Smith Squat
  '930a2eec-3f54-4039-ba9b-1560f6774af0': 'SMITH_MACHINE_SQUAT', // Smith Squat To Bench
  'baa210b0-158a-4191-acff-8d7db7928a05': 'ZERCHER_SQUAT', // Smith Zercher Squat
  '1dd0ba84-d102-4e5a-ad25-58ebfa8edf9f': 'BARBELL_SNATCH', // Snatch
  'd4e0958b-33f9-55e1-925a-5d7c0ec24df0': 'SNATCH_BALANCE', // Snatch Balance
  '93117b10-d436-5651-9624-cf14b99c7e54': 'SNATCH_GRIP_DEADLIFT', // Snatch Grip Deadlift
  '69711e18-790f-475f-a845-29932f24c730': 'BARBELL_HIGH_PULL', // Snatch Pull
  '7e3fd0e4-1437-4bd3-9ff7-dd09597beba5': 'SPANISH_SQUAT', // Spanish Squat
  '221e8991-90d5-4398-b7df-09a42bc95502': 'DUMBBELL_HAMMER_CURL', // Spider Hammer Curl
  '08809847-e2c7-5dd6-bcef-50a4e90e2f3e': 'SPLIT_JERK', // Split Jerk
  '7eafba6a-d96a-4484-bc61-a6b44d2fcdeb': 'STATIC_LUNGE', // Split Squat
  '35cd3180-abe9-417b-aebb-816d8ff6392a': 'DUMBBELL_BULGARIAN_SPLIT_SQUATS', // Split Squat Front Foot Elevated
  '4050cda9-d73a-4b37-a97e-3beaa3615d2f': 'BARBELL_BULGARIAN_SPLIT_SQUAT', // Split Squat Front Foot Elevated
  '774184ce-93a6-4250-910c-ffcca26e601f': 'PAUSED_BENCH_PRESS', // Spoto Press
  '30323e56-bacc-5515-9835-42bac0e0c86d': 'RUNNING', // Sprint
  '6ab50167-ffb3-bb30-1822-5de93c864367': 'AIR_SQUAT', // Squat
  'df8728ab-50ed-5eb2-867a-ef734180aec6': 'BODY_WEIGHT_JUMP_SQUAT', // Squat Jack
  'f988b961-9ab6-5784-9d04-25fcc10b3adb': 'SQUAT_THRUSTS', // Squat Thrust
  '5574c68f-61a7-4dd5-beb3-f89fb4c4942f': 'CRUNCH', // Stability Ball Crunch
  'c605879b-651d-4995-ae08-8ecd85182d71': 'SQUAT_GENERIC', // Stability Ball Wall Squat
  '2cc42ebe-22bc-4b27-9965-6e342ecd4c03': 'STAIRMASTER', // Stair Climber
  '7292151f-5551-45bd-a5ca-512ce6ca2683': 'CORE_GENERIC', // Standing Air Bike
  '7387956a-da42-5381-ba45-a2135671283e': 'WALL_BICEP_STRETCH', // Standing Biceps Stretch
  'b2e609bf-d783-4f44-8213-de75f13eb878': 'CABLE_CRUNCH', // Standing Cable Ab Crunch
  '199d1583-7187-407d-b15e-87d74b6fa9d1': 'BENCH_PRESS_GENERIC', // Standing Cable Chest Press
  '19281e83-c96f-550c-8823-3d78d7f64073': 'CABLE_KICKBACK', // Standing Cable Hip Extension
  '09836cd3-2e26-4f4f-8147-8be5997661b5': 'BENCH_PRESS_GENERIC', // Standing Cable Low Chest Press
  '5077809b-faae-5cc6-9eb5-a8fe0848d32b': 'SHOULDER_PRESS_GENERIC', // Standing Cable Shoulder Press
  '73517ab1-d5d8-4918-a526-df763e16cef7': 'STANDING_CALF_RAISE', // Standing Calf Raise
  'd29ecddd-e2bc-4d42-914b-7304975faa55': 'WALL_CHEST_STRETCH', // Standing Chest Opener
  '85666015-efc0-4b27-bae5-5dbb6fefc5eb': 'SHOULDER_PRESS_GENERIC', // Standing Cuban Press
  '2aeaa882-143a-4f08-96c2-709627e3ae9d': 'WARM_UP_GENERIC', // Standing Downward Dog
  '456473b0-442a-434b-8e07-b1a71872b489': 'STANDING_DOUBLE_ARM_SHOULDER_PRESS', // Standing Dumbbell Shoulder Press
  '183cf14a-3214-4b69-8047-c5ddb4fa0f08': 'STANDING_HAMSTRING_STRETCH', // Standing Forward Bend
  '1bbabd9a-dc98-5f88-93e9-84d02a8ef3b6': 'STANDING_HAMSTRING_STRETCH', // Standing Hamstring Stretch
  '85c89a46-37b2-422a-b2bf-c3a5588463de': 'STANDING_HIP_ABDUCTION', // Standing Hip Abduction
  '8c156338-a875-4603-8a40-dfa7073933eb': 'BAND_CHEST_FLY', // Standing Incline Band Chest Fly
  '4054edee-6167-40a5-b385-59e588bb451d': 'STANDING_LEG_CURL', // Standing Leg Curl
  '9f6969ca-b08f-5e58-9fdd-275c94643a8e': 'OBLIQUE_CRUNCH', // Standing Oblique Crunch
  '2669bea0-d60b-48cf-a188-59349610a9e5': 'OVERHEAD_DUMBBELL_TRICEPS_EXTENSION', // Standing One Dumbbell French Press
  'ae0c15ed-95db-41e3-a99d-8289b6ccf2a5': 'SEATED_BARBELL_OVERHEAD_TRICEPS_EXTENSION', // Standing Overhead Barbell Triceps Extension
  '2daa9660-5c47-48b6-aa22-cf6e37b411b1': 'STANDING_QUAD_STRETCH', // Standing Quadriceps Stretch
  'c7c5b6a3-7410-4ea8-9b96-98e9c00e7d46': 'RUSSIAN_TWIST', // Standing Russian Twist
  '67388acd-390f-4322-b88b-ea5aa75a5ee4': 'LAT_STRETCH', // Standing Side Lat Stretch
  '034b85f8-5cf8-4696-9351-f6c4a62f1880': 'TIBIALIS_RAISE', // Standing Tibialis Raise
  'a7033640-d772-55ec-9955-6879bb5bccc5': 'FULL_STAR_JUMPS', // Star Jump
  '7405282a-c2f6-480a-bf83-5c97dc70cb99': 'CORE_GENERIC', // Static Front Hold
  '42268083-6027-47f5-9fe8-b52652a17b77': 'STATIC_LUNGE', // Static Lunge
  '1f8d0b3c-4924-403e-aea7-4ba4dd085553': 'CARDIO_GENERIC', // Stationary Bike
  '9256737b-1f1f-4e03-a216-96e47c83ff2a': 'STEP_UP', // Step Up Lateral
  '3e9f168f-b8a4-4d40-a6bd-3705347a3460': 'STEP_UPS', // Step Ups
  '1a6fdebd-5789-415d-9724-bda20c1c846e': 'PLANK_GENERIC', // Straddle Planche
  '3f1cfc8c-a3e9-49db-b3d3-319d72fad15a': 'BODY_WEIGHT_DIP', // Straight Bar Dips
  '1fac415a-983a-4610-bb36-6c8889314a76': 'LEG_RAISE_PARALLEL_BARS', // Straight Leg Raise on Dip Bars
  'ca8fb6e9-2df5-4f97-83a0-d1595e894fba': 'STRAIGHT_ARM_PULLDOWN', // Straight-Arm Lat Pulldown
  '6ce63d5e-640e-4a37-bbd1-688e146984d0': 'BARBELL_BICEPS_CURL', // Strict Barbell Curl
  '2651ec1a-5859-446a-99c3-b2fb74eabe2a': 'SUITCASE_CARRY', // Suitcase Carry
  '7f9f4a82-47b4-4aea-9cc5-1eb32ecd4bd2': 'SUMO_DEADLIFT', // Sumo Deadlift
  'af6d1798-d9ca-59d2-8a01-df1ed6177c51': 'SUMO_DEADLIFT', // Sumo Deadlift with Short Pull
  '8c0be573-5e75-5a6f-bdbf-4e19963b063a': 'BARBELL_ROMANIAN_DEADLIFT', // Sumo Romanian Deadlift
  '8cc228e3-8daa-41c4-b1d0-cc89aee5aab6': 'SUMO_SQUAT', // Sumo Squat
  'eafc5a02-9cd9-4494-aca9-247ca14f87ee': 'SUMO_SQUAT', // Sumo Squat off Stepbox
  'cb2d0f9b-8328-46a0-bbdb-6b13db28499d': 'SUMO_SQUAT', // Sumo Squat With Smith
  'a41708d7-1cc3-5246-81b3-c52689e0ac58': 'WARM_UP_GENERIC', // Sun Salutation A
  'bd178421-8e50-40b1-a843-43b82b55c393': 'SUPERMAN', // Superman
  'bd77faa0-5c8c-4541-a1bf-7dabc3d9b614': 'SUPERMAN', // Superman
  '11cbfb54-8f47-47a4-9ff5-8c98188d4015': 'PUSH_UP_GENERIC', // Superman Push-Up
  '5777d445-65bb-519a-be1c-a507256454b5': 'SUPERMAN_FROM_FLOOR', // Superman Swimmers
  'f3d164a0-1ced-46b3-9645-7416c9835e6c': 'WARM_UP_GENERIC', // Supported Headstand
  '759f1cc2-ab13-43ea-81b2-3ad0d361be37': 'SUSPENSION_CHEST_FLY', // Suspension Chest Fly
  'cb3108e0-3ef1-57f4-a0bd-82622e9060bf': 'BENCH_PRESS_GENERIC', // Suspension Chest Press
  'a57918fc-5aad-5b5e-b059-4891f968e1b6': 'FACE_PULL', // Suspension Face Pull
  '3ba44e8d-8718-47f1-ba5f-1fd046cbb7b0': 'INVERTED_ROW', // Suspension Inverted Row
  'd586fcc3-0cd6-51fb-883f-86ddfdaf261c': 'LEG_CURL_GENERIC', // Suspension Leg Curl
  '21fbdca8-4263-4371-97ce-ba441356648c': 'SUSPENSION_LOW_ROW', // Suspension Row
  '89a304fb-07e4-562d-8489-c14600db0e7a': 'SQUAT_GENERIC', // Suspension Squat
  '84622a26-9bac-4a4e-a6cc-fa52c220dd43': 'TRICEPS_EXTENSION_GENERIC', // Suspension Triceps Extension
  '9c4894a4-9d5b-416e-8718-f957823c0ac0': 'V_UP', // Suspension V-Ups
  '47978a95-b7a5-4dcc-8034-9d301551f22c': 'SVEND_PRESS_PLATE_SQUEEZE', // Svend Press
  'd455b2bc-feaa-4d9d-8d60-b8ae1ed7b109': 'LEG_CURL_GENERIC', // Swiss Ball Leg Curl
  'ad8cbff5-7fab-47f9-8332-447ef6785681': 'PLANK_ON_SWISSBALL', // Swiss Ball Plank
  '4867c4b9-6939-4a7f-ba29-282550b7c7e6': 'T_BAR_ROW', // T-Bar Bent Over Row
  '37177273-4ac3-5c9d-af08-23c5cbbb9ee8': 'INVERTED_ROW', // Table Inverted Row
  '3eade03a-3fd3-4a80-bb11-8e8391ca9732': 'DUMBBELL_WIDEELBOW_TRICEPS_PRESS', // Tate Press
  '4241390f-1594-40a6-b067-f30b53b5b364': 'BANDED_QUAD_EXTENSION', // Terminal Knee Extension
  '77dfa88a-feaf-498d-b865-8e6d06c9fc72': 'TIBIALIS_RAISE', // Tibialis Curl
  'a8d335cd-5b80-53ef-8a3b-0ad598dc9172': 'CARRY_GENERIC', // Timber Frame Carry
  '642f9aae-59c8-5b92-a160-1c20749e2a9e': 'TIRE_FLIP', // Tire Flip
  '6145db6a-402e-58f5-a0a2-135ff22cb3f6': 'CRUNCH', // Toe Touch Crunch
  'a2cad050-a2b9-46e2-bdae-6198b1aaec21': 'WARM_UP_GENERIC', // Toe Touches
  '6f6e176e-fe86-4e95-be39-55fb09d9fb5a': 'TOES_TO_BAR', // Toes To Bar
  '05b6ff87-c208-4188-a6c8-ff28cb990a5c': 'SQUAT_GENERIC', // Touch Down Squad
  '7a939762-896c-461e-ad6a-88e7be837e7b': 'TRAP_BAR_DEADLIFT', // Trap Bar Deadlift
  'fdde5774-088d-5b7d-9674-91334d16e695': 'BODY_WEIGHT_JUMP_SQUAT', // Trap Bar Jump Squat
  'ba67a5a7-7a06-49c2-92eb-9cf8dc8b9419': 'BARBELL_SHRUG', // Trap Bar Shrugs
  'ac39bb5d-d66c-4660-85ac-3a4255acc5e7': 'FLOOR_Y_RAISE', // Trap Y Raise
  '47582674-26cc-49c2-a66f-06655b49ab34': 'CARDIO_GENERIC', // Treadmill Climbing
  'e9c8793b-9ae2-4428-a9af-24ce91ce8c99': 'RUNNING', // Treadmill Run
  '312dea8a-3c08-5e3d-b640-75560e64ea21': 'CARDIO_GENERIC', // Treadmill Walk
  'c48984e5-3830-4cc5-9d99-d74066febb22': 'TRICEPS_EXTENSION_GENERIC', // Triceps Cable Kickback
  '68978b20-90bd-479a-98b4-311164673268': 'DIAMOND_PUSH_UP', // Triceps Push-Up
  '9a3a896f-9adb-41f5-806b-7935e88caedf': 'TRICEPS_PRESSDOWN', // Triceps Pushdown V-Bar
  '5476b9ee-ef6e-4e87-a52e-753e5901bb39': 'SUSPENSION_BICEP_CURL', // TRX Biceps Curl
  'c8837562-afba-4d90-b0bb-31b0b17a0a7d': 'BIRD_DOG', // TRX Single Leg Bird Dog
  'f29a4a3f-4309-4159-9ef1-369beea0eec2': 'OVERHEAD_BARBELL_PRESS', // Tsunami Overhead Press
  '9dbee1e1-6db2-5da8-9a40-d3a81f1815c3': 'FRONT_LEVER_HOLD', // Tuck Front Lever
  '107c2b20-11be-4ce8-bf56-acf0a3a60a0b': 'CORE_GENERIC', // Tuck Hold
  '29225001-dac5-53dc-bce7-ebfac429f45a': 'PLYO_GENERIC', // Tuck Jump
  'e0b32a23-df0f-597e-992f-79a9eafe4d93': 'CORE_GENERIC', // Tuck-Up
  'c9f28dee-814d-4cef-910a-6161ca46382d': 'TURKISH_GET_UP', // Turkish Get Up
  '426e476b-b2ff-5646-a281-2ba6bedfd448': 'OBLIQUE_CRUNCH', // Twisting Crunch
  '1867ddc7-68d0-5447-8687-a2b9758d773c': 'SHOULDER_PRESS_GENERIC', // Two-Arm Landmine Press
  'b611633c-e2e5-402a-b4d6-7e758e2b35bb': 'TRICEPS_PRESSDOWN', // Underhand Triceps Extension
  '8d0b122e-3029-4722-a56a-9b9aa76575bf': 'SUITCASE_CARRY', // Unilateral Farmer Walk
  'ed9b5a18-18d0-4d80-bb07-b67f0ad96663': 'SUITCASE_CARRY', // Unilateral Farmer Walk
  'c72a049f-1825-4bf6-acd4-dfaaf6513733': 'SINGLE_LEG_STANDING_CALF_RAISE', // Unilateral Standing Machine Calf Raise
  'b9bc61a6-00e8-4743-8175-d75b404869a6': 'HANGING_KNEE_RAISE', // Unoszenie Kolan Do Klatki Ławka Rzymska
  '4ba95999-f228-4fdd-98d9-3a18a699f357': 'BARBELL_UPRIGHT_ROW', // Upright Row Into OHP
  'a7384dbe-5d12-4cae-ac06-e479c71e855b': 'COBRA', // Upward Dog
  '6ecd75f3-0bf2-457e-a994-63b52cea84ce': 'CRUNCH', // V-Sit Crunch
  '67fa769c-8cc6-497a-b27e-5355bc085b3c': 'V_UP', // V-Up
  '9181ee11-473b-4ea3-9435-31ff0ec7e39f': 'V_UP', // V-Up
  '80023f63-7d56-5740-87dc-fc307ed66d97': 'LEG_PRESS', // Vertical Leg Press
  'c6a3ceee-90a3-4f19-8e37-4630cb144391': 'LEG_PRESS', // Vertical Leg Press Smith Machine
  'cd499966-2c32-4b4d-9bf6-440fcc3a84e4': 'CARDIO_GENERIC', // Walking Cardio
  '679a7c5d-76aa-4c2e-b43e-8e8915db63f7': 'WALKING_LUNGE', // Walking Lunges
  'fc6c96c9-4445-409c-afd9-f6d42d832492': 'WALL_SLIDE', // Wall Angel
  'faca0a4a-f064-576b-b898-512de06f6b18': 'WALL_BALL', // Wall Ball Shot
  '999bb449-36ce-54d4-9f58-6c9b1467e481': 'TOES_AGAINST_WALL_CALF_STRETCH', // Wall Calf Stretch
  'a4580aa1-27ff-5229-a679-26bfdbf41023': 'PALLOF_PRESS', // Wall Pallof Hold
  '42038068-31b2-5b1c-b755-ca22fe8b31a9': 'WALL_PUSH_UP', // Wall Push-Up
  '7ae2d1b0-a634-4374-86e8-a8c48f77e1ee': 'WALL_SIT', // Wall Sit
  '564e72ed-54ff-5d2d-8bca-7a9bea007989': 'WALL_WALK', // Wall Walk
  'cf64c96d-3e95-424d-8066-f0824463de81': 'CRUNCH', // Weighted Ab Crunches
  '4cb4b1c0-7e5d-e804-d5ef-0fbe23f53914': 'BACK_EXTENSION', // Weighted Back Extension
  '41662ae6-2248-41f7-a3fe-b870534c3fad': 'BENCH_DIP', // Weighted Bench Dips
  '78395663-8332-42cc-8aa7-d87f474bdb10': 'WEIGHTED_CHIN_UP', // Weighted Chin Up
  'd374a71e-3113-4f6e-aef3-78d741d2468d': 'CLAMS', // Weighted Clamshell
  '829f1936-4f5c-489f-a084-39bcba74332e': 'COSSACK_SQUAT', // Weighted Cossack Squat
  '51e5cf00-61bf-4289-bfc9-8551dac4e91c': 'DEADBUG', // Weighted Dead Bug
  '11abe949-7bce-4971-95c0-f754772ee813': 'WEIGHTED_DECLINE_CRUNCH', // Weighted Decline Crunch
  '7d2cd887-427f-4961-9e15-c0ed65d6be30': 'DIAMOND_PUSH_UP', // Weighted Diamond Push Up
  '0935adff-a0ca-78d8-32f8-11f0f8d211f8': 'WEIGHTED_CHEST_DIP', // Weighted Dips
  '748a1a5b-cbb1-48b0-96bd-7558f332cb48': 'GLUTE_BRIDGE', // Weighted Glute Bridge
  'cebcd0b9-f4ec-483e-b2cf-f759efd759f4': 'HANGING_LEG_RAISE', // Weighted Hanging Leg Raise
  '8ea0e1cc-2f71-4868-a6eb-9a475f0ea8ae': 'HOLLOW_ROCK', // Weighted Hollow Body Hold
  '33363886-6ac4-5253-ab98-8886c05cb358': 'TOTAL_BODY_GENERIC', // Weighted Lying Neck Extension
  'c48d3682-7b85-45cb-bbb6-731ca86f4a08': 'MUSCLE_UP', // Weighted Muscle-Up
  'd426fbe7-b7df-4671-8499-d2e4df127ec6': 'PISTOL_SQUAT', // Weighted Pistol Squat
  '73240447-5323-4b6d-99ce-cffbffb19a07': 'PLANK_HOLD', // Weighted Plank
  '04cc2a5a-b69d-4ef3-b6f8-3e6a6115403b': 'PULL_UP_GENERIC', // Weighted Pull-Up
  'f511d489-bd64-4a83-8713-8445d53b1d8e': 'PUSH_UP_GENERIC', // Weighted Push-Up
  'c7920eaf-9cfe-47e3-adf5-c56a528557d0': 'LEG_EXTENSIONS', // Weighted Reverse Nordic Curl
  'a741580c-cf0a-49d6-a30d-5ee70ad9be0c': 'RUSSIAN_TWIST', // Weighted Russian Twist
  '12c994b1-6251-4d3e-96e6-8186ee6a0afd': 'SEATED_CALF_RAISE', // Weighted Seated Calf Raise
  'dce4c635-fc59-4ee1-933b-28e835620eda': 'SIDE_PLANK', // Weighted Side Plank
  '06eba846-19b2-4802-88d2-e49c43184e13': 'SISSY_SQUAT', // Weighted Sissy Squat
  '2f181b12-c156-48f8-bfb4-efc2ffc650dc': 'SIT_UP_GENERIC', // Weighted Sit Up
  '1aebfa21-78be-447d-abc5-366df35d3aef': 'CRUNCH', // Weighted Straight Arm Crunch
  'cc80c096-6e65-4bef-9a96-5741c1e6dbce': 'SUMO_SQUAT', // Weighted Sumo Double-Squat
  '70322856-de83-4f89-b6ab-71c40159d7ed': 'CABLE_WOODCHOP', // Weighted Woodchopper
  '337e4449-47d4-4482-9bed-47404f889db7': 'MACHINE_CHEST_SUPPORTED_ROW', // Wide Grip Chest Supported Row
  '5b5ad96b-a5d1-a271-9b57-aa0dfda9d77b': 'LAT_PULLDOWN', // Wide Grip Lat Pulldown
  '1ded3dfe-6517-40db-909b-dc8b4b64d932': 'WIDE_PULL_UP', // Wide Grip Rear Pull-Up
  '8266ca36-8fae-4fa4-bebb-8c38a0301ac6': 'BARBELL_BICEPS_CURL', // Wide Grip Standing Barbell Curl
  'c8749939-52da-4147-9e62-e6be2b23b6a5': 'PUSH_UP_GENERIC', // Wide Push-Up
  'f1b9f105-5605-483a-8635-c316444be9d2': 'ROW_GENERIC', // Wiosłowanie na wyciągu w opadzie na kolanach
  '858eb1d3-8e27-4fc0-8582-5b70e37b4864': 'WORLDS_GREATEST_STRETCH', // World’s Greatest Stretch
  'faa4c3c5-2276-4933-826f-cc678b4e6676': 'CURL_GENERIC', // Wrist Curl on Machine
  '55772f28-ccb6-4f43-9293-5a63501271b7': 'PUSH_UP_GENERIC', // Wrist Push-Up
  '789d1358-a903-4173-a4e0-986c8c2bc045': 'WRIST_ROLLER', // Wrist Roller
  '568d1b1f-8e2a-4e12-9e2b-b8b6236c9d64': 'FRONT_RAISE', // Wznosy hantli w przód leżąc na brzuchu na ławce ze skosem dodatnim
  'e9ccf643-ce6e-4649-99db-578be4230ac8': 'BACK_EXTENSION', // Wznosy tułowia w opadzie
  '8e3d5cfc-aac8-481f-aaa1-21a7767cfae1': 'BENT_OVER_BARBELL_ROW', // Yates Row
  'a1f5e668-0ab3-4c53-91ed-a006cb5e0f97': 'SWISS_BALL_JACKKNIFE', // Yoga Ball Know Trucks
  'b9fc3c2b-b68b-4c94-bd08-2b28b7359bbb': 'ZERCHER_SQUAT', // Zercher Squat
  'a4d33596-4074-5029-8f31-0d4280ddf3c0': 'ZERCHER_SQUAT', // Zercher Squat Hold
  '01f198ca-a257-4bf8-9f34-24f1f1179376': 'DUMBBELL_ZOTTMAN_CURL', // Zottman Curl
};

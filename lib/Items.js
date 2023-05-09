

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export const getCategories = () => { return {
    DEFAULT: {
        bgColor: "bg-gray-300",
        borderColor: "border-gray-800"
    },
    EN: {
        bgColor: "bg-yellow-300",
        borderColor: "border-yellow-800",
        icon: <FontAwesome name="smile-o" size={16} color="white" />
    },
    HE: {
        bgColor: "bg-red-300",
        borderColor: "border-red-800",
        icon: <Entypo name="heart" size={16} color="white" />
    },
    HU: {
        bgColor: "bg-green-300",
        borderColor: "border-green-800",
        icon: <Ionicons name="fast-food" size={16} color="white" />
    },
    HY: {
        bgColor: "bg-blue-300",
        borderColor: "border-blue-800",
        icon: <FontAwesome name="bathtub" size={16} color="white" />
    },
}};

export const Items = {
    //Entertainment
    EN: { 
        RBK: {
            name: 'Read Books',
            points: 30, 
            weight: 4,
            src: 5
        },
        PCG: {
            name: 'Play Console Games',
            points: 80,
            weight: 1,
            src: 3
        },
        WTS: {
            name: 'Watch TV Shows',
            points: 60,
            weight: 2,
            src: 6
        },
        LTM: {
            name: 'Listen to Music',
            points: 20,
            weight: 5,
            src: 4
        },
        GFS: {
            name: 'Go Fishing',
            points: 20,
            weight: 5,
            src: 2
        },
        PDT: {
            name: 'Play Darts',
            points: 50,
            weight: 3,
            src: 1
        },
        PBL: {
            name: 'Play Bowling',
            points: 50,
            weight: 3,
            src: 0
        }
    },
    // //Knowledge
    // KN: {
    //     SGG: {
    //         name: 'Study Geography',
    //         points: 30,
    //         weight: 2,
    //         src: -1
    //     },
    //     SCH: {
    //         name: 'Study Chemistry',
    //         points: 30,
    //         weight: 2,
    //         src: -1
    //     },
    //     PPT: {
    //         name: 'Practice Painting',
    //         points: 30,
    //         weight: 2,
    //         src: -1
    //     },
    //     SLT: {
    //         name: 'Study Literature',
    //         points: 40,
    //         weight: 1,
    //         src: -1
    //     },
    //     PWT: {
    //         name: 'Practice Writing',
    //         points: 25,
    //         weight: 2.5,
    //         src: -1
    //     },
    //     SMM: {
    //         name: 'Study Mathematics',
    //         points: 40,
    //         weight: 1,
    //         src: -1
    //     },
    //     OSC: {
    //         name: 'Observe Species',
    //         points: 40,
    //         weight: 1,
    //         src: -1
    //     },
    //     BSI: {
    //         name: 'Brainstorm Ideas',
    //         points: 20,
    //         weight: 3,
    //         src: -1
    //     }
    // },
    //Health
    HE: {
        LBB: {
            name: 'Lift Barbells',
            points: 50,
            weight: 2.5,
            src: 7
        },
        RAB: {
            name: 'Ride a Bike',
            points: 20,
            weight: 4,
            src: 8
        },
        PBX: {
            name: 'Practice Boxing',
            points: 20,
            weight: 4,
            src: 9
        },
        GMC: {
            name: 'Get a Medical Checkup',
            points: 80,
            weight: 1,
            src: 10
        },
        GDC: {
            name: 'Get Dental Checkup',
            points: 70,
            weight: 1.5,
            src: 11
        },
        LDB: {
            name: 'Lift Dumbbells',
            points: 40,
            weight: 3,
            src: 12
        },
        TWD: {
            name: 'Treat Wounds',
            points: 15,
            weight: 5,
            src: 13
        },
        DJR: {
            name: 'Do Jump Ropes',
            points: 20,
            weight: 4,
            src: 14
        },
        LKB: {
            name: 'Lift Kettlebells',
            points: 30,
            weight: 3.5,
            src: 15
        },
        TMD: {
            name: 'Take Medicine',
            points: 60,
            weight: 2,
            src: 16
        },
        UTM: {
            name: 'Use Treadmill',
            points: 20,
            weight: 4,
            src: 17
        },
        RVC: {
            name: 'Receive Vaccines',
            points: 60,
            weight: 2,
            src: 18
        },
        TVM: {
            name: 'Take Vitamins',
            points: 30,
            weight: 3.5,
            src: 19
        }
    },
    //Hunger
    HU: {
        CRS: {
            name: 'Croissant',
            points: 25,
            weight: 3.75,
            src: 26
        },
        BRG: {
            name: 'Burger',
            points: 60,
            weight: 2,
            src: 23
        },
        HTD: {
            name: 'Hotdog',
            points: 40,
            weight: 3,
            src: 30
        },
        MIT: {
            name: 'Meat',
            points: 80,
            weight: 1,
            src: 31
        },
        CKN: {
            name: 'Chicken',
            points: 80,
            weight: 1,
            src: 25
        },
        PZZ: {
            name: 'Pizza',
            points: 70,
            weight: 1.5,
            src: 32
        },
        FRS: {
            name: 'Fries',
            points: 20,
            weight: 4,
            src: 29
        },
        SDW: {
            name: 'Sandwich',
            points: 50,
            weight: 2.5,
            src: 34
        },
        RMN: {
            name: 'Ramen',
            points: 30,
            weight: 3.5,
            src: 33
        },
        BDE: {
            name: 'Boiled Egg',
            points: 25,
            weight: 3.75,
            src: 21
        },
        CHS: {
            name: 'Cheese',
            points: 10,
            weight: 4.5,
            src: 24
        },
        SSG: {
            name: 'Sausage',
            points: 30,
            weight: 3.5,
            src: 35
        },
        BGT: {
            name: 'Baguette',
            points: 25,
            weight: 3.75,
            src: 20
        },
        EGG: {
            name: 'Egg',
            points: 20,
            weight: 4,
            src: 28
        },
        DNT: {
            name: 'Donut',
            points: 15,
            weight: 4.25,
            src: 27
        },
        BRD: {
            name: 'Bread',
            points: 20,
            weight: 4,
            src: 22
        }
    },
    //Hygiene
    HY: {
        TAB: {
            name: 'Take a Bath',
            points: 80,
            weight: 1,
            src: 36
        },
        BTT: {
            name: 'Brush Teeth',
            points: 40,
            weight: 2.5,
            src: 42
        },
        SVH: {
            name: 'Shave Hair',
            points: 30,
            weight: 3,
            src: 40
        },
        STH: {
            name: 'Style Hair',
            points: 20,
            weight: 3.5,
            src: 38
        },
        DRH: {
            name: 'Dry Hair',
            points: 20,
            weight: 3.5,
            src: 37
        },
        APL: {
            name: 'Apply Lotion',
            points: 10,
            weight: 4,
            src: 39
        },
        UTL: {
            name: 'Use Toilet',
            points: 70,
            weight: 1.25,
            src: 41
        },
        WSH: {
            name: 'Wash Hands',
            points: 50,
            weight: 2,
            src: 43
        }
    }
    
}
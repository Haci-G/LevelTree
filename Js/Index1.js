
/*Fix voor probleem met de uilijning van Brightest text in de modal bij gebruik van Safari*/
let isBrowserSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isBrowserSafari) {
    document.getElementById('logo-text-modal').style.marginTop = "280%";
    document.getElementsByClassName('item-legende')[0].style.width = "250px";

}

// arrow  bottom margin need to be 2.4 em in firefox

//Bij het laden van de pagina wordt er rustig uigezoomd tot de boom volledig zichtbaar is
window.addEventListener('load', (event) => {
    // document.getElementById("zoomStartpunt").click();
    //setTimeout(terugNaarStart, 500);




});


//Check of de pagina herladen wordt, zoja? ga terug naar de homepage. Oplossing voor bug met het laden van info in de modal.
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.location.href = "home1.html";
}



function CreateScripts() {

    JsScript.forEach((e) => {
        let scriptTag = document.createElement('script');
        scriptTag.type = e.type;
        scriptTag.src = './Js/' + e.src;

        referenceNode = document.querySelector('body');


        referenceNode.appendChild(scriptTag);

    })

};


let JsScript = [
    {
        "type": "text/javascript",
        "src": "jquery.zoomooz-zoomTarget.js"
    },
    {
        "type": "text/javascript",
        "src": "purecssmatrix.js"
    },
    {
        "type": "text/javascript",
        "src": "jquery.zoomooz-helpers.js"
    },
    {
        "type": "text/javascript",
        "src": "jquery.zoomooz-anim.js"
    },
    {
        "type": "text/javascript",
        "src": "jquery.zoomooz-core.js"
    },


    {
        "type": "text/javascript",
        "src": "sylvester.src.stripped.js"
    },
]


function terugNaarStart() {

    document.getElementById('tree').click();
    document.getElementById("header").style.display = "flex";

    if (SlidInOutBOX() == true) {
        SlidInOutBOX();
    }


}


function CreateToolTips() {

    DataLevels.forEach((level) => {

        let toolTipDiv = document.createElement('div');
        toolTipDiv.id = `tooltipLv${level.id}`;
        toolTipDiv.setAttribute('data-level', level.id);
        toolTipDiv.setAttribute('data-targetsize', 0.11);
        toolTipDiv.setAttribute('data-duration', 600);
        toolTipDiv.className = `zoomTarget tooltip tooltip${level.id} zoomTarget`;


        // Create inner element of Tooltip,
        toolTipDiv.innerHTML = `
        <a href="#popup" class="tooltip__trigger" onclick="OpenModel(${level.id})">
                <p class="title-font">${level.id}</p>
        </a>
        <div class="tooltip__wrapper_boven w_lv${level.id} level${level.id}">
            <div class="tooltip__title_center">
                <p>${level.name}</p>
            </div>
        </div>`;

        let divBoom = document.querySelector('#container-boom')
        divBoom.appendChild(toolTipDiv);
    });

}

function CreateLegendElement() {

    let legendDiv = document.createElement('div');
    legendDiv.id = "legende";

    DataLegend.forEach((legend) => {

        legendDiv.innerHTML += `
            <div class="item-legende">    
                <div class="circle-legende ${legend.uniqueClassName}"></div>
                <p>${legend.name}</p>
            </div>
        `;
    });
    document.querySelector('footer').appendChild(legendDiv);
}

/* functions for Modal */
function OpenModel(lvl_Id) {



    lvl = DataLevels.find(x => x.id == lvl_Id);


    document.querySelector("header").style.display = "none";


    /*LEVEL TITLE*/
    document.getElementById('modal-title').innerHTML = lvl.title;

    /*LEVEL EXPERIENCE*/
    document.getElementById('modal-experience').innerHTML = lvl.experience;




    /* LEVEL ACCORDIONS */

    let accordionContainer = document.getElementById('accordion-container');

    accordionContainer.innerHTML = ""; // Empty element

    // Loop through Level Experience Data






    lvl.levelExperience.forEach((Experience, index) => {

        /*Div voor de inhoud van de accordion*/
        let containerContentAccordion = CreateAccordionContent(Experience.SkillName, index, accordionContainer);

        //Inhoud van de accordion

        ulElement = document.createElement("ul");
        containerContentAccordion.appendChild(ulElement);

        for (const [key, value] of Object.entries(Experience)) {

            if (key != "SkillName") {


                for (const subValue of value) {

                    let liElement = document.createElement("li");
                    liElement.innerHTML = subValue;

                    liElement.classList.add(`cat-${key}`);

                    ulElement.appendChild(liElement);

                }
            }
        }

    });



    if (lvl.Testimonials != null) {

        let index = accordionContainer.childElementCount;
        let containerContentAccordion = CreateAccordionContent("Testimonials", index, accordionContainer);

        //Create Carousel Div ()
        let slideDiv = document.createElement("div");
        slideDiv.classList.add("slide-container");

        // create carousel slider
        let SectionCarousel = document.createElement('section');
        SectionCarousel.classList.add('box');
        SectionCarousel.setAttribute('id', 'slider');


        lvl.Testimonials.forEach((e, index) => {

            // create div : thumbnail for images
            let thumbnail = document.createElement('div');


            thumbnail.classList.add('thumbnail');


            thumbnail.setAttribute('data-title', e.title);
            thumbnail.setAttribute('data-id', e.id);

            // thumbnail Click EventListener
            thumbnail.addEventListener('click', function () {
                openInfoFrame(this);
            })



            // create image for the thumbnail
            let imageThumbnail = CreateImageElementForCarouselThumbnail(e, index)

            thumbnail.append(imageThumbnail);

            SectionCarousel.appendChild(thumbnail);

        });


        // add arrow when the are more then 2 item.

        // check later 

        let buttonEffect = false;
        if (SectionCarousel.childElementCount > 3) {

            // left arrow
            slideDiv.appendChild(CreateArrowCarousel('left', 'prev'));

            slideDiv.appendChild(SectionCarousel);

            // right arrow
            slideDiv.appendChild(CreateArrowCarousel('right', 'next'));
            buttonEffect = true;
        }
        else {
            slideDiv.appendChild(SectionCarousel);
        }
        containerContentAccordion.appendChild(slideDiv);

        SliderEffect(buttonEffect);

    }



}


function CreateAccordionContent(Name, index, mainDiv) {

    // Create div for Level Experience
    let accordion = document.createElement("div");
    accordion.classList.add("accordion");
    mainDiv.appendChild(accordion);

    // Initialize Input Element.
    let inputAccordion = document.createElement("input");
    inputAccordion.id = `check${index}`;
    inputAccordion.setAttribute("type", "radio");
    inputAccordion.setAttribute("name", "radio-a");

    //Mag alleen maar voor de eerste true zijn
    // if (index == 0) {
    //     inputAccordion.checked = true;
    // }

    accordion.appendChild(inputAccordion);

    /*Label voor de accordion*/
    let labelAccordion = document.createElement("label");
    labelAccordion.classList.add("accordion-label");

    labelAccordion.setAttribute("for", "check" + index);
    labelAccordion.innerHTML = Name;

    accordion.appendChild(labelAccordion);

    let containerContentAccordion = document.createElement("div");
    containerContentAccordion.classList.add("accordion-content");

    accordion.appendChild(containerContentAccordion);

    accordion.appendChild(containerContentAccordion);

    return containerContentAccordion;
}





// create arrow
function CreateArrowCarousel(arrowSide, dataSlide) {
    // arrowSide : availanames => left, right,
    // dataSlide : Prev || next
    arrow = document.createElement("a");
    arrow.classList.add("arrow")
    arrow.setAttribute("role", "button");
    arrow.setAttribute("id", "slide-" + arrowSide);
    arrow.setAttribute("data-slide", dataSlide);

    spanSign = document.createElement('span');
    if (arrowSide == 'left') {
        spanSign.innerHTML = '&#60;';
    }
    else {
        spanSign.innerHTML = '&#62;';
    }

    arrow.appendChild(spanSign);
    return arrow;
}


// slider effect
function SliderEffect(buttonON = false) {
    let thumbnails = document.getElementsByClassName('thumbnail');
    let slider = document.getElementById('slider');

    if (buttonON) {
        let buttonRight = document.getElementById('slide-right');
        let buttonLeft = document.getElementById('slide-left');

        buttonLeft.addEventListener('click', function () {
            slider.scrollLeft -= -75;
        })

        buttonRight.addEventListener('click', function () {
            slider.scrollLeft += 75;
        })
    }


    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    // alert(maxScrollLeft);
    // alert("Left Scroll:" + slider.scrollLeft);

    //AUTO PLAY THE SLIDER
    function autoPlay() {
        if (slider.scrollLeft > (maxScrollLeft - 1)) {
            slider.scrollLeft -= maxScrollLeft;
        } else {
            slider.scrollLeft += 1;
        }
    }
    let play = setInterval(autoPlay, 50);

    // PAUSE THE SLIDE ON HOVER
    for (var i = 0; i < thumbnails.length; i++) {

        thumbnails[i].addEventListener('mouseover', function () {
            clearInterval(play);
        });

        thumbnails[i].addEventListener('mouseout', function () {
            return play = setInterval(autoPlay, 50);
        });
    }
}


function CreateImageElementForCarouselThumbnail(objTest, index) {

    let image = document.createElement('img');

    image.setAttribute('data-type', objTest.type);

    //image.setAttribute('onclick', openInfoFrame(objTest.title));

    if (objTest.type == "yt") {
        image.setAttribute('data-YTVideoID', objTest.videoId);
        image.src = `https://i.ytimg.com/vi/${objTest.videoId}/hqdefault.jpg`;

    } else if (objTest.type == "text") {
        image.src = `./Assets/Testimonials/${objTest.image}`;
    }

    return image;
}



function SlidInOutBOX() {
    let SlidBox = document.querySelector('.FrameBox');
    let closed = SlidBox.classList.toggle("popFrame");

    if (!closed)
        document.querySelector("#ContentBox").innerHTML = "";

    return closed;

}


function openInfoFrame(thumbnailEle) {

    let ELId = thumbnailEle.getAttribute('data-id')

    let testObj = null;

    for (obj of DataLevels) {
        if (obj.Testimonials != null)
            for (const sub of obj.Testimonials) {
                if (sub.id == ELId) {
                    testObj = sub;
                }
            }
    }


    let ContentSlidBox = document.querySelector('#ContentBox');
    ContentSlidBox.innerHTML = "";

    let titleEle = document.createElement("h1");

    ContentSlidBox.appendChild(titleEle);

    titleEle.classList.add("titleContent")
    titleEle.innerHTML = testObj.title;


    let SubElement = null;
    if (testObj.type == "yt") {
        // Iframe for youtube video
        SubElement = document.createElement('iframe');
        SubElement.src = `https://www.youtube-nocookie.com/embed/${testObj.videoId}`;
        SubElement.title = testObj.title;
        SubElement.frameBorder = 0;
        SubElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media;";
        SubElement.allowfullscreen = true;
        SubElement.controls = true;
        SubElement.id = "YtFrame";

    }
    else if (testObj.type == "text") {

        SubElement = document.createElement('div');
        SubElement.id = "TextBox";

        let pElement = document.createElement('p');
        pElement.classList.add("testimonialText");
        pElement.innerText = testObj.text;

        let imgPerson = document.createElement('img');
        imgPerson.classList.add("PersonImage");

        imgPerson.src = `./Assets/Testimonials/${testObj.image}`;
        imgPerson.alt = `Image ? ${testObj.title}`;

        SubElement.appendChild(pElement);
        SubElement.appendChild(imgPerson);
    }

    ContentSlidBox.appendChild(SubElement);
    SlidInOutBOX();

}



const DataLegend = [
    //  {
    //    name: "Brightest",
    //    color: "yellow"
    //  },
    {
        name: "Manual Test Expertise",
        color: "#63b330",
        uniqueClassName: "manual-legende-circle"
    },
    {
        name: "Technical Expertise",
        color: "red",
        uniqueClassName: "technical-legende-circle"
    },
    {
        name: "Lead Expertise",
        color: "blue",
        uniqueClassName: "lead-legende-circle"
    }
];
CreateLegendElement();





// Template 
const DataLevels = [
    {
        "id": 1,
        "title": "LEVEL 1 AGILE TEST ENGINEER",
        "name": "Agile test engineer",
        "experience": "< 1 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Result oriented",
                    "Flexibility",
                    "Teamwork",
                    "Quality focussed",
                    "Professional attitude",
                    "Bright Ambassador (Like & share Brightest posts, verbal,..."
                ],

            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "Understanding code",
                    "Test Automatization (tooling) basics",
                    "SQL, XML, JSON",
                    "Test Management Tools basics (incl. defect mngt)"

                ],
                "technical": [
                    "Automatization Framework basics",
                    "Programming skills basics",
                    "Performance Testing basics"
                ],
            },
            {
                "SkillName": "Test Skills",
                "tester": [
                    "Structured Testing (test Design basics)"
                ],
            },
            {
                "SkillName": "Qualifications",
                "tester":
                    [
                        "Bachelor of Master degree (or eq. in experience)",
                        "ISTQB Foundation CTFL certification"
                    ],
                "technical": [
                    "Start with swITch"
                ],
            },
        ],
        "Testimonials": [
            {
                "id": 11,
                "type": "text",
                "title": "Nick Sheeren",
                "image": "PersonB.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                "id": 12,
                "type": "yt",
                "title": "Shift-left | Test Automation",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 13,
                "type": "yt",
                "title": "Conversations with a software tester",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 14,
                "type": "yt",
                "title": "Conversations with a software tester",
                "videoId": "LnRFrIe-1gI"
            },
        ]
    },
    {
        "id": 2,
        "title": "LEVEL 2 AGILE TEST ENGINEER",
        "name": "Agile test engineer",
        "experience": "< 1 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "First Time Right attitude (setting the example, ask for advice & explanations where necessary)",
                    "Communication skills (verbal & non-verbal)",
                    "Proactive (think ahead/with your team)",

                ]
            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "Basic coding & scripting skills",
                    "API Testing basics"
                ],
                "technical": [
                    "API Test Automation",
                    "Using Automation Framework/Tools",
                    "Technology basics: NodeJS, GIT, CI/CD, Rest, PHP MySQL, Java IntelliJ, Microservices, ..."
                ]

            },
            {
                "SkillName": "Test Skills",
                "tester": [
                    "Basic test estimation & reporting (for yourself)"
                ],
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Basic Training / Presentation skills"
                ],
            },
            {
                "SkillName": "Qualifications",
                "tester": [
                    "ISTQB Certified Agile Tester",
                    "BDD Essentials"
                ],
                "technical": [
                    "swITch track finalized"
                ]
            }
        ]
    },
    {
        "id": 3,
        "title": "LEVEL 3 AGILE TEST AUTOMATION ENGINEER",
        "name": "Agile test automation engineer",
        "experience": "> 2 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Ownership",
                    "Self-development",
                    "Assertiveness",
                    "Detect opportunities (at customer)"
                ],
                "lead": [
                    "Lead/coach a small team (1 - 3 people)",
                    "Basic coaching and coordination skills"
                ]
            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "DevOps Basic Concepts (via training =>)",
                    "Shift-left Basic Concepts (via training =>)",
                    "Build Domain(s) Expertise (your specialisations / ambitions)",
                ],
                "technical": [
                    "Automation tool specialist",
                    "Java, Javascript/Typescript of C# knowledge",
                    "Advanced SQL or noSQL db's",
                    "Optional specialisation: Performance testing Advanced skills"
                ]
            },
            {
                "SkillName": "Test Skills",
                "tester": [
                    "Able to select \"Test Mngt Tool\" & organise",
                    "Exploratory Testing (via (self)training) =>)",
                    "Build Domain Expertise (sector, QA related topics)"
                ],
                "lead": [
                    "basic project estimates & reporting"
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Training & Presentation skills"
                ],
            },
            {
                "SkillName": "Qualifications",
                "tester": [
                    "Shift-left concepts (incl. TDD unit testing principles,...)",
                    "DevOps Basic Concepts",
                    "Exploratory Testing",
                    "Train the trainer (IF Brightest Trainer)",
                ],
                "lead": [
                    "Certified Scrum Master",
                    "Test Management Basics (incl. reporting, estimation,...)",
                ]
            }
        ],
        "Testimonials": [
            {
                "id": 15, // needs to be UNIEK
                "type": "yt",
                "title": "Conversations with a software tester",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 16,
                "type": "yt",
                "title": "Stage Bij Brightest",
                "videoId": "aHI8Wmkny0c"
            },
            {
                "id": 17,
                "type": "yt",
                "title": "Shift-left | Test Automation",
                "videoId": "ElZ_2bb25lA"
            },
        ]
    },
    {
        "id": 4,
        "title": "LEVEL 4 AGILE TEST COORDINATOR",
        "name": "Agile test coordinator",
        "experience": "> 3 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Networking (sell Brightest to possible candidates & extra solutions for customer)",
                    "Adaptability (easy integration in new situations/customers)",
                    "Organisational sensitivity",
                    "Detect opportunities (outside your own customer)",
                    "Lead by example",
                    "Bright Ambassador (Share own content on social media,...)",
                ],
                "lead": [
                    "Lead/coach a few small teams (3 - 5 people)"
                ]
            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "Content Coaching (for your specialisations)",
                ],
                "technical": [
                    "Build Automation Framework",
                    "Advanced programming skills (OOP, design patterns,...)",
                    "DevOps Advanced (via training =>)"
                ]
            },
            {
                "SkillName": "Test Skills",
                "tester": [
                    "Shift-left (able to assess testing pyramid)",
                    "Content Coaching (sector, QA related topics)",
                ],
                "lead": [
                    "Project estimation & reporting"
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Construct Trainings (content)",
                    "Write blogs, papers, articles (content)",
                    "Knowledge Sharing (gastcollege's, stagebegeleiding, ...)"
                ]
            },
            {
                "SkillName": "Qualifications",
                "tester": [
                    "Scaled Agile Concepts (training mPower)",
                    "IREB certification"
                ],
                "technical": [
                    "Prince2 Certified",
                    "SwITch final assignment (for those who didn't follow swITch)",
                    "DevOps Advanced training",
                ],
                "lead": [
                    "Prince2 Certified",

                ]

            }
        ],
        "Testimonials": [
            {
                "id": 18, // needs to be UNIEK
                "type": "yt",
                "title": "Title",
                "videoId": "jGZF-ChYJ3A"
            },
            {
                "id": 19,
                "type": "yt",
                "title": "sdfssds",
                "videoId": "w1HdAe9rjig"
            },
            {
                "id": 38,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]

    },
    {
        "id": 5,
        "title": "LEVEL 5 PRO",
        "name": "Pro",
        "experience": "> 4 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Leadership skills (motivation, team vision alignment, ...)",
                    "Independence (team decisions, organisation,...)",
                    "Coach teammembers",
                ],

                "lead": [
                    "Conflict Management",
                    "Budgetting",
                    "Manage/Lead/coach more then 3 teams (of 5 - 10 people) or 1 test project (with possible several teams) (operational level)"
                ]
            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "Expert Coach in at least 1 domain (your specialisation)",
                    "Able to make POC in at least 1 domain (your specialisation)",
                    "Build Domain(s) Expertise (your specialisations - self development: new trends, ...)",
                    "Advanced SQL or noSQL db's"
                ],
                "technical": [
                    "Test Automation POC"
                ],
                "lead": [
                    "DevOps Advanced (via training =>)"
                ]
            },
            {
                "SkillName": "Test Skills",
                "tester": [
                    "Expert Coach in at least 1 domain (sector, QA related)",
                    "Build Domain(s) Expertise (sector, QA related topics - self development: new trends, ...)",
                ],
                "lead": [
                    "Project planning & organisation (budget, resources, approach, ...)",
                    "IREB certification", "Assist in Assessing a QA organisation (assist Brightscan)",
                ]
            }
            ,
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "BPC role (possible to take up)",
                    "Construct Trainings (all in)",
                    "Write blogs, papers, articles (all in)",
                    "Knowledge Sharing (brown bags, webinars, ...)"
                ]
            },
            {
                "SkillName": "Qualifications",
                "tester": [
                    "Acceleration track: leading yourself + Value based selling",
                    "ISTQB Advanced Certified: Test Analyst",
                ],
                "technical": [
                    "ISTQB Advanced Certified: Technical Test Analyst",
                ],
                "lead": [
                    "DevOps Advanced training"
                ]
            }
        ],
        "Testimonials": [
            {
                "id": 20, // needs to be UNIEK
                "type": "yt",
                "title": "Title",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 21,
                "type": "yt",
                "title": "sdfssds",
                "videoId": "jGZF-ChYJ3A"
            },
            {
                "id": 22,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]
    },
    {
        "id": 6,
        "title": "LEVEL 6 JEDI",
        "name": "Jedi",
        "experience": "> 7 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Market orientation (commerciele ingesteldheid, snappen wat nodig voor de klant & hoe vertalen nr onze solutions / cross selling)",
                    "Independence (multiple team decisions, organisation,...)",
                    "Leadership skills (motivation, multiple team vision alignment, ...)",
                    "Coach teams (dev, analyst, PO, ...)",
                ],
                "lead": [
                    "Manage/Lead/Coach several Test projects (1-5 projects) (operational level)"
                ]
            },
            {
                "SkillName": "Technical Skills",
                "technical": [
                    "Able to select Automation Tool",
                    "Set up test automation process (CI/CD, testing pyramid, ...) "
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [

                    "Presales",
                    "Proposal Writing (content delivery)",
                    "Value Based SPIN Selling (solution sales) (customer & colleagues)",
                    "Public speaking (domain / expertise on events)",
                    "Solution Architect (trekken van R&D, groep bijeen krijgen om aan dingen te werken, iets organiseren, lead workforces, ...)",
                    "Set up Continuous Improvement track (for your teams/small organisations)"
                ],
            },
            {
                "SkillName": "Qualifications",
                "tester": [
                    //GENERAL
                    "Acceleration track: leading others & the company"
                ],
                "techincal": [
                    //SPECIFIC
                    "BDD Practitioner",
                    "ISTQB Advanced Certified: Test Manager"
                ]
            }
        ],
        "Testimonials": [
            {
                "id": 23, // needs to be UNIEK
                "type": "yt",
                "title": "Title",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 24,
                "type": "yt",
                "title": "sdfssds",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 25,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                "id": 26,
                "type": "text",
                "title": "Nick sHeeren",
                "image": "PersonB.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]
    },
    {
        "id": 7,
        "title": "LEVEL 7 CZAR",
        "name": "Czar",
        "experience": "> 10 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Organisational Leadership skills (strategic level)",
                    "Change Management skills (able to solve complex issues & guide organisations to next level)",
                    "Intrapreneurship",
                    "Stress resilience",
                    "Delegation",
                ],
                "lead": [
                    "Manage/Lead/Coach several Test projects (5+ projects) (strategic level)",
                    "Test Competence Lead",
                ]
            },
            {
                "SkillName": "Test Skills",
                "lead": [
                    "Asses QA organisation (all in Brightscan)"
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Innovation ideas",
                    "Proposal Writing (incl. budgets, all in)",
                    "Key account management",
                    "Be part of Brightest as a company (lead \"area\")",
                    "Content review or decide on subjects for (articles, blogs, papers...)",
                    "Set up & implement Continuous Improvement track (conceptual, organisation wide)"
                ]
            },
            {
                "SkillName": "Qualifications",
                "lead": [
                    "ITIL Foundation"
                ]

            }

        ],
        "Testimonials": [
            {
                "id": 27,
                "type": "yt",
                "title": "zefdzefzef",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 28,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]

    },
    {
        "id": 8,
        "title": "LEVEL 8 GURU",
        "name": "Czar",
        "experience": "> 15 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Negotiation Skills",
                    "Delivery management (opvolgen van projecten bij klanten, implementatie trajecten, ...)",
                ],
                "lead": [
                    "Lead QA company wide (strategic level)",
                    "Manage/Lead/Coach several Test projects or Test managers (5+) (strategic level)",
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Organise external events (content, sector, ...)",
                    "Tender uitwerken (all in)",
                    "Business development",
                    "Create new services/solutions"
                ]
            }


        ],
        "Testimonials": [
            {
                "id": 29,
                "type": "yt",
                "title": "zefdzefzef",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 30,
                "type": "yt",
                "title": "Are You A Tester",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 31,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                "id": 32,
                "type": "text",
                "title": "Nick Sheeren",
                "image": "PersonB.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                "id": 33,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },

        ]

    },
    {
        "id": 9,
        "title": "LEVEL 9 WZARD",
        "name": "Wzard",
        "experience": "> 15 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Drive innovation",
                    "Inspire people",
                    "Brightest Ambassador (breathe Brightest)"
                ]
            },
            {
                "SkillName": "BTO/C Skills",
                "tester": [
                    "Public speaking for the top (C-level)",
                    "Partner material (e.g. area manager (location))"
                ]

            }
        ],
        "Testimonials": [
            {
                "id": 34,
                "type": "yt",
                "title": "zefdzefzef",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 35,
                "type": "text",
                "title": "Haci Guney",
                "image": "PersonA.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                "id": 36,
                "type": "yt",
                "title": "zefdzefzef",
                "videoId": "jGZF-ChYJ3A"
            },
            {
                "id": 37,
                "type": "yt",
                "title": "zefdzefzef",
                "videoId": "w1HdAe9rjig"
            },
        ]
    }



]


// Data Need to come before the objects
// are initialized
CreateToolTips();

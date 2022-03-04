

function browserChecker(browserUser) {

    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
    } else {
        browserName = "No browser detection";
    }
    if (browserName == browserUser) {
        return true;
    }
    return false;
}


//Bij het laden van de pagina wordt er rustig uigezoomd tot de boom volledig zichtbaar is
window.addEventListener('load', (event) => {
    //  document.getElementById("zoomStartpunt").click();
    //  setTimeout(terugNaarStart, 500);

    //Sneeuweffect mag niet automatisch starten
    // snowStorm.stop(); snowStorm.freeze();

    //Functie om achtergrond aan te passen naar gelang het seizoen
    CheckSeizoen();

    /*Fix voor probleem met de uitlijning van Brightest text in de modal bij gebruik van Safari*/
    if (browserChecker("safari")) {
        document.getElementById('logo-text-modal').style.marginTop = "280%";
        document.getElementsByClassName('item-legende')[0].style.width = "250px";
        document.getElementsByClassName('item-legende')[1].style.width = "250px";
        document.getElementsByClassName('item-legende')[2].style.width = "250px";
        document.querySelector(".item-legende").style.width = "250px";
    }
});

//Check om te kijken welk seizoen we nu zijn. Achtergrond past zich aan naargelang het seizoen
function CheckSeizoen() {
    const zomer = "zomer";
    const herfst = "herfst";
    const winter = "winter";
    const lente = "lente";


    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    const d = new Date(today);
    /*const d = new Date("6/24/2022");*/


    let seasonArray = [
        { name: lente, date: new Date(d.getFullYear(), 2, (d.getFullYear() % 4 === 0) ? 19 : 20).getTime() },
        { name: zomer, date: new Date(d.getFullYear(), 5, (d.getFullYear() % 4 === 0) ? 20 : 21).getTime() },
        { name: herfst, date: new Date(d.getFullYear(), 8, (d.getFullYear() % 4 === 0) ? 22 : 23).getTime() },
        { name: winter, date: new Date(d.getFullYear(), 11, (d.getFullYear() % 4 === 0) ? 20 : 21).getTime() }
    ];

    const season = seasonArray.filter(({ date }) => date <= d).slice(-1)[0] || { name: winter }

    switch (season.name) {
        case winter:
            //Snowstorm is een aparte JS file genaamd snowstorm.js
            snowStorm.start();
            snowStorm.resume();
            break;
        case herfst:
            BackgroundAnimationDisplayChange(season.name.toLowerCase());
            break;
        case zomer:
            BackgroundAnimationDisplayChange(season.name.toLowerCase());
            break;
        default:
            document.querySelector(".springseason").style.display = "block";
            SpringSeason();
    }
    console.log()
}

// functie om per seizoen de juiste achtergrond animatie te laten zien
function BackgroundAnimationDisplayChange(id) {
    let gezochteItem = document.getElementById(id);

    //Alleen bij herfst moet display prop flex zijn
    if (id === "herfst") {
        gezochteItem.style.display = "flex";
        return;
    }
    gezochteItem.style.display = "block";
}

//Check of de pagina herladen wordt, zoja? ga terug naar de homepage. Oplossing voor bug met het laden van info in de modal.
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.location.href = "index.html";
}


function terugNaarStart() {

    document.getElementById('tree').click();
    document.getElementById("header").style.display = "flex";

    //Functie terug uitvoeren om deze opnieuw zichtbaar te maken na het sluiten van de modal
    CheckSeizoen();

    if (SlidInOutBOX() == true) {
        SlidInOutBOX();
    }


}

// functie om alle tooltips te genereren

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

// functie om de legende onderaan de pagina te genereren
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

/* functie voor de modal (aanmaken, openen en opvullen met de juiste info) */
function OpenModel(lvl_Id) {


    // Fetch  request  lvl_Id (Testing)
    // let lvl = await fetch(`http://localhost:5001/Levels?id=${lvl_Id}`).then((response) => response.json()).then((d) => d[0])
    // console.log(lvl);

    //Bij het openen van de modal alle achtergronden van de seizoenen verbergen
    document.getElementById("herfst").style.display = "none";
    document.getElementById("zomer").style.display = "none";
    document.querySelector(".springseason").style.display = "none";

    snowStorm.stop();
    snowStorm.freeze();


    let lvl = DataLevels.find(x => x.id == lvl_Id);
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
        let ulElement = document.createElement("ul");
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


    accordion.appendChild(inputAccordion);

    /*Label voor de accordion*/
    let labelAccordion = document.createElement("label");
    labelAccordion.classList.add("accordion-label");

    labelAccordion.setAttribute("for", "check" + index);
    labelAccordion.innerHTML = Name;

    //Eerste accordion moet actief zijn
    if (index == 0) {
        inputAccordion.checked = true;
    }
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

    if (browserChecker("firefox")) {
        arrow.style.marginBottom = "2.43em";
    }

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
            slider.scrollLeft = slider.scrollLeft - 55;
        })

        buttonRight.addEventListener('click', function () {
            slider.scrollLeft += 55;
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


//Array met alle data voor de legende onderaan de pagina (text, color, classnames)
const DataLegend = [
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



//Alle data voor de modals(title, experience, dropdowns, carousel, ...)

const DataLevels = [

    //---------------------------LEVEL1---------------------------
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
                    "Bright Ambassador (Like & share Brightest posts, verbal,...)"
                ]
            },
            {
                "SkillName": "Technical Skills",
                "tester": [
                    "Understanding code",
                    "Test Automation (tooling) basics",
                    "SQL, XML, JSON",
                    "Test Management Tools basics (incl. defect mngt)"

                ],
                "technical": [
                    "Automation Framework basics",
                    "Programming skills basics",
                    "Performance Testing basics"
                ]
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
                ]
            },
        ],
        "Testimonials": [
            {
                "id": 101,
                "type": "yt",
                "title": "Meet Hannelore - Brightest SwITch",
                "videoId": "sjrPJzeONhs"
            },
            {
                "id": 102,
                "type": "yt",
                "title": "Conversations with a software tester | Part 1",
                "videoId": "LnRFrIe-1gI"
            },
            {
                "id": 103,
                "type": "yt",
                "title": "Conversations with a software tester | Part 2",
                "videoId": "Glhj0cvNVMk"
            },
            {
                "id": 104,
                "type": "yt",
                "title": "Conversations with a software tester | Part 3",
                "videoId": "kmWCeRC9oNg"
            },
            {
                "id": 105,
                "type": "text",
                "title": "Michael",
                "image": "michael.jfif",
                "text": " In september startte ik als software quality engineer bij Brightest East. Ik werd meteen goed opgevolgd. Vaak voelen mensen zich een “nummer” in een bedrijf, maar bij Brightest is dat absoluut niet het geval. Hier wordt bijvoorbeeld echt iets gedaan met de feedback die ze ons vragen.\n" +
                    "Brightest in drie woorden: feest, collega’s en kwaliteit. Brightest kent een sterke groei, er wordt hard ingezet op het versterken van de band tussen (nieuwe) collega’s. Alle collega’s zijn super behulpzaam. Je hoeft maar een mail of bericht te sturen om hulp te krijgen. En die kwaliteit, da’s iets waar zowel Brightest als ik heel hard naar streven.\n" +
                    "\n" +
                    "Wat vind ik zo boeiend aan software quality? Het kritisch denken. De logica achter een keuze in het ontwikkelingsproces te weten komen en mee helpen zoeken naar een oplossing.\n" +
                    "\n" +
                    "De belangrijkste dingen in mijn leven zijn mijn familie en vrienden. Wat ook heel belangrijk is voor mij: streven naar telkens een betere versie van mezelf worden, zowel op persoonlijk als professioneel vlak. Verder ga ik graag sporten en lees ik wel eens een boek. Mijn interesses veranderen wel voortdurend: het ene moment ga ik graag kickboksen en lees ik boeken van Stephen Hawking, het andere moment ben ik meer geboeid door fitness en Griekse mythologie. De enige constante is dat ik een fervent supporter ben van Arsenal FC 😊\n" +
                    "Wat me nog typeert: droge humor en parate kennis (mijn vriendin denkt dat ik Google ben). Mij mag je altijd wakker maken voor een leuke citytrip! Liefst niet te vroeg, want ik ben geen ochtendmens 😄"
            },
            {
                "id": 106,
                "type": "text",
                "title": "Robby",
                "image": "robby.jfif",
                "text": "Enkele weken geleden startte ik bij Brightest East. Wat me het meest is bijgebleven aan mijn start is de familiale sfeer en een heel warm welkom. Ook de hulp van iedereen. Heb je een vraag over je opstart of ben je er niet zeker van hoe bepaalde zaken in elkaar zitten, één mail volstaat. Je krijgt snel antwoord. Alle neuzen binnen het bedrijf staan ook in dezelfde richting. Werk je nu op HQ, in East of West: iedereen zal je dezelfde antwoorden geven en met hetzelfde gevoel over Brightest spreken.\n" +
                    "\n" +
                    "Brightest in drie woorden: familiaal, warm en professioneel. Je bent geen nummer; je maakt deel uit van een team. Dit vind ik echt top; zeker in een bedrijf waar iedereen als consultant werkt bij externe klanten; om dan toch dergelijk hecht team te hebben vind ik een mooie prestatie. Bij Brightest is ook alles altijd op en top professioneel. Gaande van het materiaal dat je dient te krijgen, tot de opleidingen die iedereen kan volgen, van etentjes tot business meetings, ... het is altijd top.\n" +
                    "\n" +
                    "Het meest interessante aan software quality vind ik de veelzijdigheid van de job waarin je een brede visie moet behouden. Je moet communicatief sterk zijn en een soort van helikopterview behouden om alle stukjes van het verhaal mooi samen te laten vallen. Deel uit kunnen maken van het gehele proces van een product of dienst waarbinnen je een bepaalde verantwoordelijkheid krijgt om ervoor te zorgen dat het product zo kwalitatief mogelijk is.\n" +
                    "\n" +
                    "Mijn gezin is het belangrijkste in mijn leven. Ik ben getrouwd en heb één zoon. Zij betekenen alles voor mij. Mijn vrije tijd gaat dus ook vooral naar hen, van fijne uitstapjes tot kamperen en vakanties. Als ik nog tijd over heb, ben ik in mijn vrije tijd vooral bezig met gamen, Muay Thai om mijn fysiek wat bij te houden of een fijne wandeltocht om volledig tot rust te komen.\n" +
                    "Wat mij typeert: ik ben een sociaal persoon die houdt van interactie. Iemand die eerlijk en vriendelijk is en open staat voor nieuwe zaken, iemand die altijd op zoek is naar een uitdaging om te blijven bijleren.\n" +
                    "Mij mag je altijd wakker maken voor een etentje 😊 Of een saunabezoekje om volledig te ontspannen!"
            },
            {
                "id": 107,
                "type": "text",
                "title": "Bjorn",
                "image": "bjorn.jfif",
                "text": "Ik vind software quality interessant omdat je er mee voor kan zorgen dat een software applicatie de best mogelijke kwaliteit krijgt. Daarnaast ben je bij verschillende facetten in het hele process betrokken en dat maakt het allemaal heel boeiend voor mij.\n" +
                    "\n" +
                    "Zelf ben ik nog maar recent in het SwITch traject van Brightest gestart maar ik heb al snel ontdekt dat alle collega’s heel toegankelijk zijn en dat je met iedereen, van junior tot senior, de meest boeiende gesprekken kan hebben. Ook de algemene begeleiding en de hulp van in het begin zijn enorm groot. Brightest in drie woorden:\n" +
                    "\n" +
                    "1/ Gepassioneerd. Elke persoon die je ontmoet binnen Brightest heeft een enorme drive om er voor te gaan.\n" +
                    "2/ Expertise. Je kan met al je vragen steeds terecht bij de juiste persoon. Je hebt als het ware een trein van kennis achter je.\n" +
                    "3/ Smiles. Alle collega’s zijn goedlachs en ontzettend sympathiek.\n" +
                    "\n" +
                    "Wat me typeert als persoon is dat ik steeds erg geboeid ben door nieuwe technologieën, tot grote spijt van mijn portemonnee 😊.\n" +
                    "Daarnaast zien andere mensen mij als iemand die graag helpt en altijd klaar staat voor hen. Naast mijn job ben ik ook geboeid door wat ik het best zou kunnen omschrijven als: ‘creatief bezig zijn’. Mijn drone is daar een voorbeeld van. Fotografie blijft ook een grote hobby. En ja, af en toe een game op de pc kan zeker ook geen kwaad.\n" +
                    "\n" +
                    "Ja, plezier maken is voor mij ontzettend belangrijk in het leven, alles is een reden om de slingers op te hangen. Als afsluiter, voor de volgende zaken mag je me altijd wakker maken: koffiekoeken in een airbnb met een zicht om U tegen te zeggen. Een roadtrip naar de middle of nowhere. Een rit in iets op vier wielen dat zeer snel van A naar B kan."
            },
            {
                "id": 108,
                "type": "text",
                "title": "Pieter",
                "image": "pieter.jfif",
                "text": "Wat mij typeert is mijn creativiteit en out-of-the-box mindset aangevuld met een flinke portie sociale skills. Het zal dus ook niet verbazen dat ik voor een job als software quality consultant kies.\n" +
                    "\n" +
                    "In deze rol krijg je te maken met alle facetten van een software-project en daarbij is het leggen van contacten met zowel analisten, programmeurs, business, klanten, … essentieel. Al deze partijen tevreden te houden is nog een ander staaltje vakmanschap en daar komt mijn creativiteit en toegankelijkheid zeker van pas, gelukkig hou ik ook van een gezonde dosis uitdaging. 😉\n" +
                    "\n" +
                    "Toegankelijkheid is niet alleen mijn middle name maar is zeker ook één van de sterktes van Brightest. Mensen werken voor mensen, en dat hebben ze hier goed begrepen. Mijn start kan omschreven worden als een leerrijk feest. Zo mocht ik meteen aan een interessante opleiding starten, gingen we royaal op restaurant en ontdekte ik wat een “teammeeting” betekent in Brightest normen. Dat valt niet meer te vergeten! 🥳 Intern heerst er een informele sfeer waardoor je je meteen op je gemak voelt. Verder vind ik het fantastisch om te zien hoe dat gecombineerd wordt met het professionele aspect van het runnen van een bedrijf. Dat is een combi die je in realiteit toch niet heel vaak tegen komt en waar ze hier wel in slagen!"
            },
            {
                "id": 109,
                "type": "text",
                "title": "Ali",
                "image": "Ali.jfif",
                "text": "Enkele weken geleden startte ik bij Brightest East (Genk) als software quality consultant. Het viel meteen op dat Brightest een warme omgeving is; iedereen is super vriendelijk en behulpzaam." +
                    "\nBrightest in drie woorden: 1 Verbondenheid. \nIk voel me aanvaard en gewaardeerd, en daardoor voelde ik me meteen heel verbonden." +
                    "\nIedereen deelt ideeën met elkaar, er is een heel goede samenwerking. \n2 Energie. Er is een dynamische cultuur met veel sociale events.\n3 Stimulerend. De vele levendige conversaties, er is zoveel te leren,..." +
                    "\nIk verwacht bij Brightest te groeien en zo ook bij te dragen aan de groei van het team. Wat ik zo boeiend vind aan software quality: je bekijkt een product vanuit meerdere invalshoeken. \n Je test uitvoerig vanuit verschillende mogelijke scenario’s, en van daaruit doe je suggesties voor optimalisaties. Je draagt bij aan de kwaliteit en de waarde van het product, en dat geeft veel voldoening. De belangrijkste dingen in mijn leven zijn: een doel hebben, doen wat je écht wilt doen, gezondheid, humor, en natuurlijk familie, vrienden en muziek! Ik heb meerdere instrumenten en speel vooral gitaar en drum, maar ik heb ook meer etnische instrumenten zoals Kalimba of xylofoon. Ik experimenteer graag met verschillende instrumenten.Wat me verder typeert: ik ben empathisch, dankbaar voor alles in het leven, hecht veel waarde aan persoonlijke ontwikkeling. Ik maak graag mooie herinneringen, maar tegelijk vind ik het belangrijk om te leren van moeilijkere momenten.Je mag me altijd wakker maken voor een backpack trip. Cuba zou fijn zijn 😉"
            },
            {

                "id": 110,
                "type": "text",
                "title": "Ian",
                "image": "Ian.jfif",
                "text": "Ik startte enkele weken geleden bij Brightest East (Genk) in het SwITch traject. Wat me het meest bijblijft aan mijn start is de goede begeleiding en opleiding, en dat iedereen heel vriendelijk is. Al bij de ondertekening van mijn contract voelde ik me welkom in de groep. Zo mocht ik al deelnemen aan een event, nog voor ik begonnen was." +
                    "\nIedereen is heel betrokken, zo sturen ze bijvoorbeeld een berichtje om te vragen hoe de eerste dag is gegaan, succes te wensen, of proficiat als je het ISTQB examen hebt gehaald." +
                    "\nHet meest interessante aan software quality vind ik dat je een impact kan hebben op software, zonder dat mensen het door hebben. Je zorgt dat de software beter werkt waardoor de gebruiker geen problemen ondervindt. Er is niets zo irritant als software die crasht als je het nodig hebt of gewoon niet werkt wanneer je je even wilt ontspannen." +
                    "\n" +
                    "\nBrightest in drie woorden:" +
                    "\n1| Caring. Je wordt als mens behandeld, niet als een nummer. Dit zit in kleine dingen (zoals de “succes” en “proficiat” berichtjes) maar ook in grotere, zoals de hulp rond mentale en fysieke gezondheid, de opleidingen, groeitraject,..." +
                    "\n2| Team. Voor een bedrijf waar iedereen bij een externe klant werkt, is het echt een hecht team. Iedereen kent elkaar en helpt elkaar wanneer nodig." +
                    "\n3| Groei. Brightest geeft je de mogelijkheid om je skills te laten groeien. Dit is in het SwITch traject centraal, maar ook daarbuiten zijn er veel opleidingen die je kan volgen om nieuwe tools en skills te leren." +
                    "\nVoor mij zijn de belangrijkste dingen in het leven mijn katten (Nio en Noortje) en mijn moeder die me altijd heeft geholpen en klaar stond voor me. Games zijn ook belangrijk voor mij; zonder games kon het goed zijn dat ik nooit had gedacht om in de IT wereld te gaan! Ik ben heel geboeid door de technologie erachter: hoe computers deze software kunnen runnen zonder problemen en ook mensen connecteren over de hele wereld met bijna geen delay." +
                    "\n" +
                    "\nWat me verder typeert: ik wil altijd nieuwe dingen leren en nieuwe technologie gebruiken. Iets nieuw zoals virtual reality of de 'metaverse' interesseren me heel erg. Innovatie is fascinerend!" +
                    "\n" +
                    "\nJe mag mij altijd wakker maken voor: frietjes 😊"
            },
            {
                "id": 111,
                "type": "text",
                "title": "Robbert",
                "image": "Robbert.jfif",
                "text": "Eind december startte ik als software quality consultant bij Brightest East (Genk). Ik voelde me meteen welkom, al van de dag dat ik mijn contract ging ondertekenen. Het zat in kleine gebaren. Ook werd ik de dag voor mijn officiële start thuis opgehaald door mijn Bright People Coach. Die bracht me naar het hoofdkantoor in Kontich, waar ik mijn wagen kon ophalen. Die rit naar Kontich geeft je meteen ook de kans om elkaar beter te leren kennen. Ook alle “succes” berichten en het telefoontje om te vragen hoe de eerste dag was verlopen, waren heel fijn." +
                    "\nBrightest in drie woorden:" +
                    "\n✅ Persoonlijk. Bij de sollicitatie wordt er vooral gekeken naar de persoon achter het CV. Hoe je social skills tot hun recht komen en hoe je bent in de omgang." +
                    "\n✅ Groei. Brightest geeft veel kansen om te blijven groeien. Zo zijn er tal van opleidingen die je kan volgen." +
                    "\n✅ Team. Er hangt een enorme toffe sociale en huiselijke sfeer en er worden veel teamactiviteiten georganiseerd die dit nog versterken. Iedereen is oprecht geïnteresseerd in wie je bent en heel open tegenover elkaar." +
                    "\nHet meest interessante aan software quality vind ik de mix tussen technische en sociale vaardigheden. Ik ben redelijk technisch en zeer sociaal, dus dat komt goed uit." +
                    "\nHet belangrijkste in mijn leven is een goede vader zijn, en een goede gezondheid voor mij en mijn gezin. Verder ben ik geboeid door sport: ik heb al vanalles gedaan, maar momenteel doe ik enkel nog fitness. Als er nog tijd over is, werk ik verder aan kleine programmeerprojecten voor mezelf. Wat me verder typeert: ik ben zeer sociaal en enorm gemotiveerd om te groeien en dingen bij te leren. Dat gaat bij Brightest zeker in orde komen. 😊" +
                    "\nJe mag mij altijd wakker maken voor: hmm, dat wordt moeilijk want ik ben altijd heel vroeg wakker. Maar moest het je toch lukken.. dan sport ik wel het liefst in de vroege ochtend."
            },
            {
                "id": 112,
                "type": "text",
                "title": "Florian",
                "image": "Florian.jfif",
                "text": "FLORIAN | In september startte ik als software quality engineer bij Brightest East. Alles was meteen goed geregeld en als er een probleem was, werd dit meteen opgelost. Iedereen is heel open en enthousiast. Wat me verder nog is bijgebleven aan m’n start: de vlotte babbels met de collega’s, de leuke etentjes, het team event met “de geitjes in East”, de gezellige team meeting in Kontich,..." +
                    "\nBrightest in drie woorden?" +
                    "\n👉 Groei: jezelf blijven ontwikkelen is heel belangrijk en bij Brightest is dit heel aanwezig. De Masterclass is hier al een voorbeeld van en verder zijn er nog tal van andere opleidingen die Brightest aanbiedt die je kan volgen om steeds bij te leren." +
                    "\n👉 Expertise: Brightest is een bedrijf dat in mijn ogen perfect de balans legt tussen een informele en professionele aanpak. Ze weten het beste hoe je je kan ontspannen en plezier kan maken, maar ze staan ook steeds klaar om iets in orde te brengen. Je voelt dat je in een bedrijf zit dat weet wat ze doen en dit ook altijd optimaal aanpakken. Er staat altijd iemand klaar met de nodige kennis om je verder te helpen." +
                    "\n👉 Sociaal: als consultant is contacten leggen natuurlijk zeer belangrijk en dat merk je hier, iedereen is enthousiast en toont ook interesse in elkaar. Zo waren er toen ik in de Masterclass zat al tal van mensen van Brightest die me vroegen hoe de opstart was gegaan en hoe ik me voelde binnen het bedrijf. De babbels zijn altijd heel spontaan." +
                    "\nWat vind ik zo boeiend aan software quality? Kunnen bijdragen aan de kwaliteit van de opgeleverde software alsook in contact komen met de verschillende procedures die de software doorloopt. Daarmee bedoel ik dat we niet enkel in contact komen met de developers maar ook met mensen van de business en analisten. Verder haal ik voldoening uit het elimineren van bugs en vind ik de diversiteit van de domeinen van software quality aantrekkelijk." +
                    "\nHet belangrijkste voor mij in mijn leven: een goede gezondheid, familie en vrienden, en mijn huisdieren. Daarnaast hou ik van films en series (vooral MARVEL films), muziek, en speel ik voetbal op provinciaal niveau. Ik train twee maal per week en in het weekend heb ik wedstrijd. Ik ben ook supporter van de Duitse voetbalploeg Mönchen Gladbach. Daar ben ik geboren en mijn grootouders wonen er nog steeds. Als de coronamaatregelen het toelaten, ga ik één tot twee keer per jaar ter plekke een wedstrijd kijken samen met mijn papa. Tijdens de rust mag een lekkere Duits curryworst niet ontbreken 😃 Als ik nog tijd over heb, game ik ook graag op mijn nieuwe PS5 of zelfgemaakte gaming-pc." +
                    "\nWat me verder typeert: als ik het in gametaal mag beschrijven noem ik mij een ‘completionist’ die voor alle achievements gaat. Ik ben iemand die graag op alle vlakken in orde is. Ik ben ook iemand die niet graag altijd hetzelfde doet; ik heb graag variatie." +
                    "\nWaarvoor mag je me wakker maken? Een citytrip, een leuke wandeling door het bos of gewoon gezellig thuis een film of serie kijken."
            }
        ]
    },
    //---------------------------LEVEL2---------------------------
    {
        "id": 2,
        "title": "LEVEL 2 AGILE TEST ENGINEER",
        "name": "Agile test engineer",
        "experience": "> 1 year experience",
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
        ],
        "Testimonials": [
            {
                "id": 201,
                "type": "text",
                "title": "Carole",
                "image": "Carole.jfif",
                "text": "Ik ben recent gestart bij Brightest West (Gent). Wat me het meeste is bijgebleven aan mijn eerste dag op het hoofdkantoor in Kontich, was de grote verwelkoming op het televisiescherm aan de muur in de lounge. Veel mensen spraken me aan met de vraag \"Ben jij Carole?\" waarna ze mij een warm welkom heetten. Ik voelde me meteen op mijn gemak." +
                    "\n" +
                    "\nBrightest in drie woorden?" +
                    "\n👉 Team: je komt terecht in een hecht team. Iedereen is open en vriendelijk en er wordt altijd plezier gemaakt." +
                    "\n👉 Kwaliteit: Brightest heeft een breed aanbod van kwalitatieve opleidingen en ze proberen je persoonlijke kwaliteiten ook mee op te bouwen door een goede ondersteuning, uitdagende projecten en mee te denken over je toekomstplannen." +
                    "\n👉 Sportief: de gezondheid en sport komt veel aan bod binnen Brightest. Er worden sportevenementen georganiseerd, en voor wie wilt is er persoonlijke begeleiding met sport- en voedingscoaches." +
                    "\n" +
                    "\nHet meest interessante aan software quality vind ik de structuur die achter elke software, codeertaal, testplan, teststap zit. Ik vind het leuk om mezelf uit te dagen om alles nog duidelijker, overzichtelijker, sneller te kunnen laten lopen. Bepaalde opstellingen, structuren, queries vinden die helpen bij het dagelijks testen." +
                    "\n" +
                    "\nDe belangrijkste dingen in mijn leven: een gezonde mindset en levensstijl en de motivatie om te werken voor mezelf en de mensen rondom mij. Ik ben dagelijks bezig met voeding en train ongeveer vijf dagen in de week. Ik vind het leuk om een vaste routine te hebben van werk - sport - ontspanning. Binnen de fitness wereld hangt er ook een enorme \"feel good\" sfeer waardoor ik veel zelfvertrouwen heb gekregen." +
                    "\nWat me verder typeert: ik ben altijd al een ambitieus persoon geweest die weet wat ze wilt en een echte organisator is. Al van kleins af was ik niet bang om de leiding te nemen en organiseerde ik vanalles. Ik ben al vijf jaar coördinator van de dansafdeling binnen onze sportclub. Ik hou er van om alles te plannen, van mijn weekmenu tot mijn workouts tot mijn to do's. Ik ben een bezige bij die niet vaak stil zit. Maar minstens één avond in de week is het tijd voor mijn me-time Netflix moment." +
                    "\n" +
                    "\nJe mag mij altijd wakker maken voor een ontbijt, brunch, lunch of diner in een goed restaurant. Ik kan enorm genieten van lekker gaan eten, zowel in kleine bistro's als in grotere restaurants."
            }

        ]
    },
    //---------------------------LEVEL3---------------------------
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
                    "Java, Javascript/Typescript or C# knowledge",
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
                    "Basic project estimates & reporting"
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
                "id": 301,
                "type": "text",
                "title": "Edse",
                "image": "edse.jfif",
                "text": "Van m’n start bij Brightest onthou ik vooral het warme onthaal zowel in Genk als in Kontich, en de persoonlijke aanpak. Ik voelde me onmiddellijk welkom en thuis. Naast die persoonlijke aanpak staat bij Brightest kwaliteit voorop. Kwaliteit is natuurlijk belangrijk in onze job als software tester, maar Brightest gaat nog een stap verder. Brightest zorgt er voor dat alle collega’s kwaliteit kunnen leveren door voldoende opleidingsmogelijkheden aan te bieden. Wat ook heel typerend is, is de open sfeer en open communicatie.\n" +
                    "\n" +
                    "Als software quality engineer haal ik vooral voldoening uit de verantwoordelijkheid die je hebt om bij te dragen aan de kwaliteit van een applicatie. Je bent betrokken in het hele software development proces. Verder spreken me vooral de diversiteit aan taken en het sociale karakter van de rol aan.\n" +
                    "\n" +
                    "M’n collega’s hebben me intussen leren kennen als iemand die heel nieuwsgierig is, altijd open staat voor nieuwe dingen, graag mensen rond zich heeft, en altijd het positieve probeert te zien in dingen en mensen. De belangrijkste dingen in m’n leven zijn mijn dochtertje, familie, vriendinnen en een goede gezondheid (voor al deze mensen). Naast m’n job ben ik ook geboeid door dansen. Als ik nog tijd heb 😉 #momlife\n" +
                    "\n" +
                    "Je mag mij altijd wakker maken voor ijs of een leuk feestje, en dit liefst op een zonnige bestemming."
            },
        ]
    },
    //---------------------------LEVEL4---------------------------
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
                    "Shift-left skills (able to assess testing pyramid)",
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
                "id": 401,
                "type": "text",
                "title": "Gertjan",
                "image": "gertjan.jfif",
                "text": "Waarom boeit software quality me? Kwaliteit zit in meerdere aspecten: zowel het functionele (jezelf in de schoenen van de gebruiker plaatsen) als het non-functionele (achter het gordijn kijken en weten wat daar gebeurt). Zo kom je tot een kwalitatief geheel.\n" +
                    "\n" +
                    "Toen ik startte bij Brightest, stond iedereen voor me klaar. Ik reed naar huis met het gevoel “voor hen kiezen, was de juiste keuze”. Brightest in drie woorden:\n" +
                    "1/ Bright. Google geeft twee betekenissen: “giving out or reflecting much light, shining” en “intelligent and quick-witted”. Beide zijn van toepassing. De mensen zijn goedlachs, staan voor je klaar en zien er ook echt gelukkig uit. Daarnaast zijn ze experten in het vak. Je krijgt de vrijheid om je in jouw interessegebied te ontwikkelen. Je bent omringd door mensen die jou naar een volgend niveau brengen.\n" +
                    "2/ Test. We zijn een testing company, en hier kan je alles leren. Ik kan me uitleven in test automation, performance testing, QA monitoring, functional testing,...\n" +
                    "Maar ze kijken ook verder. Hoe zit het met het security inzicht van de consultants? Hoe kunnen we hen hierin sterker maken? Etc.\n" +
                    "3/ Caring. De hoeveelheid collega's die me de vraag stelt hoe het gaat: bij de start, op mijn project, met certificering,... is hier echt hoog. Je merkt dat je in een bedrijf zit waar mensen willen weten hoe het met de andere mensen gaat. Zodat ze betere consultants worden enerzijds, maar vooral zodat ze zich goed voelen anderzijds. The care level is strong in this one.\n" +
                    "\n" +
                    "De belangrijkste dingen in mijn leven zijn mijn gezin, mijn vrienden, en mijn sport (fitness). Voor een stevige ochtend workout mag je me altijd wakker maken! Daarnaast ben ik ook geboeid door Cyber Security. Wat mij typeert: ik ben diegene die met de 'wist-je-datjes' komt aanzetten in gesprekken. De zaken die anderen niet opvallen, zijn vaak dingen waar ik toch even bij stilsta. Ook ben ik iemand die vaak over veel verschillende zaken iets wil te weten komen. Ik zou mezelf dus eerder een generalist noemen. Iets wat als tester goed van pas komt!"
            },
        ]

    },
    //---------------------------LEVEL5---------------------------
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
                    "Manage/Lead/coach more then 3 teams (5 - 10 people) or 1 test project (with possible several teams) (operational level)"
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
                    "Assist in Assessing a QA organisation (assist Brightscan)",
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
                "id": 501,
                "type": "text",
                "title": "Tom",
                "image": "tom.jfif",
                "text": "Ik ben onlangs gestart bij Brightest West. Ik voelde me meteen betrokken bij het hele bedrijf. Ook al ben ik voornamelijk op het kantoor in Gent, ik werd al snel voorgesteld aan meerdere mensen binnen het bedrijf, ook de collega’s van Brightest HQ en Brightest East. Zo krijg je snel een eerste indruk van wie wie is. Iedereen is heel aanspreekbaar. Je voelt je een deel van de Brightest familie, door de persoonlijke opvolging en regelmatige check-ins van o.a. de office managers. Wat ook heel kenmerkend is: de gedrevenheid van iedereen. Dat is echt onderdeel van de bedrijfscultuur.\n" +
                    "\n" +
                    "Waarom werk ik zo graag als software quality consultant? Het verbeteren van applicaties bij klanten, daar krijg ik energie van. Er zijn verschillende manieren om functionaliteiten af te dekken en dat maakt de job heel boeiend.\n" +
                    "\n" +
                    "De belangrijkste dingen in mijn leven zijn mijn kindjes, familie, en vrienden. Daarnaast ben ik ook geboeid door fotografie, muziek, en sport (lopen en fietsen). Wat mij verder typeert? Flauwe grappen! Als je ze nog niet hebt gehoord, dan volgen ze zeker nog 😉\n" +
                    "Mij mag je altijd wakker maken voor een goed feestje! En daar kennen ze wat van hier bij Brightest 🥳️"
            },
            {
                "id": 502,
                "type": "text",
                "title": "Roel",
                "image": "Roel.jfif",
                "text": "Een tijd geleden startte ik bij Brightest East (Genk). Ik kende al enkele mensen van het East team en mocht al mee op team event. Het was leuk om zoveel bekende gezichten terug te zien. Op mijn startdag was ik uitgenodigd voor een lunch met de andere starters. De goeie toon was gezet!" +
                    "\nBrightest in drie woorden?" +
                    "\n✅ Sfeer. Bij Brightest hangt er altijd een goeie sfeer, het is er heel warm en familiaal. Als consultant bouw je soms meer een band op met de klant dan met je werkgever, maar dat is bij Brightest helemaal niet het geval." +
                    "\n✅ Behulpzaam. Ze vragen steeds jouw mening en feedback en doen er ook daadwerkelijk iets mee. Ze staan altijd voor je klaar. Vragen voor HR? Hulp nodig bij een automation project? Er is altijd iemand die je kan en wil helpen." +
                    "\n✅ Professioneel. Je wordt persoonlijk opgevolgd, van trainingen tot het in orde brengen van de wagen. Het is allemaal heel professioneel." +
                    "\nHet meest interessante aan software quality vind ik het meedraaien in het ontwikkelproces en zo de kwaliteit van de software verbeteren. Het is ook fijn om altijd met nieuwe technologieën te werken. Zo kan ik constant mijn kennis verbreden." +
                    "\nHet belangrijkste in het leven voor mij is een goede gezondheid en natuurlijk veel warmte en liefde van vrienden en familie. In mijn vrije tijd ben ik graag bezig met allerhande elektronica projectjes. Van het bouwen van een analoge synthesizer en het repareren van een oude Commodore computer tot het prullen met mijn 3d printer. Ik speel ook graag gezelschapspelletjes. En als ik 's avonds tot rust wil komen, lees ik een graphic novel. Om in conditie te blijven, ga ik cruisen op mijn longboard of een wandeling maken met mijn vriendin en het hondje in het bos." +
                    "\nWat me verder typeert: volgens mijn vriendin ben ik heel geduldig. Als iemand iets vraagt, neem ik de tijd om het grondig uit te leggen. " +
                    "\nJe mag mij altijd wakker maken voor: euh, liefst niks, ik word niet graag wakker gemaakt. 🥴️ Wat wél mag: me uitnodigen om ergens lekker te gaan eten of voor een uitstapje zoals bowlen, minigolf of een middagje Center Parks."

            },
            {
                "id": 503,
                "type": "text",
                "title": "Geert",
                "image": "Geert.jfif",
                "text": "Ik startte begin januari als test consultant bij Brightest East (Genk). Wat me het meeste is bijgebleven aan m’n start bij Brightest: thuis opgehaald worden door management om samen naar kantoor te rijden voor de eerste werkdag... Chill!" +
                    "\n" +
                    "\nBrightest in drie woorden:" +
                    "\n1⃣ Professioneel.We hebben een sterke batterij aan quality consultants.Samen zijn we in staat om elke uitdaging aan te gaan." +
                    "\n2⃣ Familiaal.Er is een toffe sfeer.Dit vormt met eensgezinde mensen de core van Brightest." +
                    "\n3⃣ Jong & verfrissend.We zijn een jong team, met waarden en een visie die daarop matchen." +
                    "\n" +
                    "\nHet meest interessante aan software quality vind ik dat je heel breed betrokken wordt in het ontwikkelingsproces van een product.Op die manier kan je met veel mensen, in verschillende rollen, samenwerken – altijd afwisseling!" +
                    "\n" +
                    "\nHet belangrijkste in mijn leven is quality time, zowel op het werk als prive.Zo breng ik veel tijd door al wandelend met de hond, of als supporter voor onze tennis - en voetbalspelende kinderen.Wat me verder typeert: ik ben een optimist, sociaal, toegankelijk, en altijd bereid om te helpen!" +
                    "\n" +
                    "\nJe mag mij altijd wakker maken voor: ik ben per definitie geregeld wakker, gezien mijn zoontje van 1 jaar 😃 Maar indien ik toch slaap mag je me altijd wakker maken voor een goed biertje(daar slaap je dan weer goed van 😊)."

            }
        ]
    },
    //---------------------------LEVEL6---------------------------
    {
        "id": 6,
        "title": "LEVEL 6 JEDI",
        "name": "Jedi",
        "experience": "> 7 year experience",
        "levelExperience": [
            {
                "SkillName": "Soft Skills",
                "tester": [
                    "Market orientation (commerciele ingesteldheid, snappen wat nodig voor de klant & hoe vertalen naar onze solutions / cross selling)",
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
                "SkillName": "Test Skills",
                "lead": [
                    "Set up test process (shift-left, ...)"
                ]
            }
            ,
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
                    "Acceleration track: leading others & the company"
                ],
                "technical": [
                    "BDD Practitioner"
                ],
                "lead": [
                    "ISTQB Advanced Certified: Test Manager"
                ]
            }
        ],
        "Testimonials": [
            {
                "id": 23,
                "type": "yt",
                "title": "Shift-left | Test Automation",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 24,
                "type": "yt",
                "title": "Conversations with a software tester",
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
                "title": "Nick 's Heeren",
                "image": "PersonB.jpg",
                "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]
    },
    //---------------------------LEVEL7---------------------------
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
                "title": "Conversations with a software tester",
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
    //---------------------------LEVEL8---------------------------
    {
        "id": 8,
        "title": "LEVEL 8 GURU",
        "name": "Guru",
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
                "title": "Shift-left | Test Automation",
                "videoId": "ElZ_2bb25lA"
            },
            {
                "id": 30,
                "type": "yt",
                "title": "Conversations with a software tester",
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
                "title": "Nick 's Heeren",
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
    //---------------------------LEVEL9---------------------------
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
                "title": "Shift-left | Test Automation",
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
                "title": "Partnership PXL | Test Automation Track",
                "videoId": "jGZF-ChYJ3A"
            },
            {
                "id": 37,
                "type": "yt",
                "title": "#BrightChallenge31",
                "videoId": "w1HdAe9rjig"
            },
        ]
    }
]

CreateToolTips();

//Seizoen animatie lente
function SpringSeason() {
    const canvas = document.getElementById("lente"),
        ctx = canvas.getContext("2d"),
        stack = [],
        w = window.innerWidth,
        h = window.innerHeight;

    const drawer = function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        stack.forEach(function (el) {
            el();
        });
        requestAnimationFrame(drawer);
    };

    const anim = function () {
        let x = 0;
        const speed = Math.random() * 0.2;
        const position = Math.random() * w - w / 2;
        const maxTall = Math.random() * 40;
        const maxSize = Math.random() * 5;
        const c = function (l, u) {
            return Math.round(Math.random() * (u || 255) + l || 0);
        };
        const color = "#64B331"; /*"rgb(" + c(60, 10) + "," + c(201, 50) + "," + c(120, 50) + ")";*/

        return function () {
            const deviation = Math.cos(x / 30) * Math.min(x / 20, 30),
                tall = Math.min(x / 4, maxTall),
                size = Math.min(x / 40, maxSize);

            x += speed;
            ctx.save();

            ctx.strokeWidth = 10;
            ctx.translate(w / 2 + position, h);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.lineTo(-size, 0);
            ctx.quadraticCurveTo(-size, -tall / 2, deviation, -tall);
            ctx.quadraticCurveTo(size, -tall / 2, size, 0);
            //ctx.closePath();
            ctx.fill();

            ctx.restore();
        };
    };

    for (var x = 0; x < 300; x++) {
        stack.push(anim());
    }

    canvas.width = w;
    canvas.height = h;

    drawer();

}

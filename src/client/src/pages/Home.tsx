
import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { layoutSlice } from '../slices/layout'

import './Home.css'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopWithScroll())
    }, [location.pathname])

    return (
        <React.Fragment>
            <div id="banner"></div>

            <div className="container text-center pt-5 pb-5">
                <span style={{ fontSize: "1.4rem" }}>"<i>We can only see a short distance ahead, but we can see plenty there that needs to be done.</i>"</span>
                <br/><br/>
                { /*
                <span>Alan Turing in <i>Computing Machinery and Intelligence</i></span>
                <br/>
                */ }
                <span>
                    <span>Turing, A. M. (1950). Computing Machinery and Intelligence. Mind, 59, 433–460. </span>
                    <a target="_blank" href="https://doi.org/10.1093/mind/LIX.236.433">https://doi.org/10.1093/mind/LIX.236.433</a></span>
            </div>

            <div className="bg-light" style={{ width: "100%" }}>
                <div className="container text-justify pt-5 pb-5">
                    Hello! Thank you for visiting my website. I am an engineer, friend, and problem solver in the solar industry.
                    I received my <b>B.S. in Computer Engineering</b> at California Polytechnic State University in
                    San Luis Obispo, California, with culminating work in human-computer
                    interaction and advanced computer architecture. This year, I plan to continue education as an incoming student to the <b>
                    M.S. in Business Analytics</b> program at University of California in Irvine, California.
                    I work as the <b>Director of Systems</b> in software analytics and strategy
                    at <a href="https://dynamicenergy.com/" target="_blank">Dynamic Energy</a>.
                    I collaborate with peers to address contemporary issues, requiring research, data modeling, and applications of advanced
                    technology. My hobbies include reading, playing guitar, and changing my lifestyle.
                    Please feel free to reach out and connect with me.
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-4 pt-5 pb-4 text-center text-lg-left">
                        <a href="#" onClick={e => e.preventDefault() } style={{ display: "inline-block", maxWidth: "300px" }}>
                            <img src="/static/images/REC Solar Headshot - Resized.png" width="100%" />
                            <h4 className="mt-3 mb-0">Engineering</h4>
                        </a>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-md-3">
                        <h4>Topics</h4>
                        <ul>
                            <li>Operational Analytics</li>
                            <li>Solar Performance Monitoring</li>
                            <li>Human-Computer Interaction</li>
                            <li>Computer Architecture</li>
                            <li>Embedded Systems</li>
                            <li>Cloud Services</li>
                        </ul>
                        <h4>Work Experience</h4>
                        <ul>
                            <li>Dynamic Energy</li>
                            <li>Duke Energy Sustainable Solutions</li>
                            <li>Microsoft Corporation</li>
                            <li>... and many more in between!</li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
                        <h4>Skills</h4>
                        <ul>
                            <li>Leadership, hiring, contracting, vision</li>
                            <li>Jupyter, Numpy, Pandas, Apache Spark</li>
                            <li>Microsoft Excel, SQL Server, Power BI</li>
                            <li>Azure App Services, Functions, Synapse</li>
                            <li>REST APIs, OAuth2 authentication, JSON</li>
                            <li>C#, .Net Core MVC, EF Core, Razor</li>
                            <li>Descriptive statistics, business analysis</li>
                            <li>Full-stack software development, deployment</li>
                        </ul>
                        <h4>Resources</h4>
                        <ul>
                            <li><a target="_blank" href="https://linkedin.com/in/14bmkelley">LinkedIn profile</a></li>
                            <li><a target="_blank" href="https://drive.google.com/drive/folders/1By-vW6D5l9-aklLVs6E2Fse54B5rh22v?usp=sharing">Downloadable resume</a></li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 col-lg-4 pt-5 pb-4 text-center text-lg-right order-lg-last">
                        <a href="#" onClick={e => e.preventDefault() } className="d-inline-block" style={{ maxWidth: "300px" }}>
                            <img src="/static/images/foodbank.jpg" width="100%" />
                            <h4 className="mt-3 mb-0">Community</h4>
                        </a>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-md-3">
                        <h4>Locations</h4>
                        <ul>
                            <li>Orange County, CA (current)</li>
                            <li>Everett, WA</li>
                            <li>San Luis Obispo, CA</li>
                            <li>Bay Area, CA</li>
                            <li>Whidbey Island, WA</li>
                        </ul>
                        <h4>Destinations</h4>
                        <ul>
                            <li>Big Bear Lake, CA</li>
                            <li>San Diego, CA</li>
                            <li>Seattle, WA</li>
                            <li>A Whirlwind of Florida!</li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
                    <h4>Team Involvement</h4>
                        <ul>
                            <li>Trivia Night!</li>
                            <li>Grassroots teams</li>
                            <li>Grid Alternative solar install</li>
                            <li>Cal Poly Computer Engineering</li>
                            <li>HackingEDU</li>
                        </ul>
                        <h4>Social</h4>
                        <div>
                            <a className="d-inline-block fa fa-facebook" href="https://facebook.com/14bmkelley" target="_blank"></a>
                            <a className="d-inline-block fa fa-twitter" href="https://twitter.com/14bmkelley" target="_blank"></a>
                            <a className="d-inline-block fa fa-instagram" href="https://instagram.com/14bmkelley" target="_blank"></a>
                            <a className="d-inline-block fa fa-linkedin" href="https://linkedin.com/in/14bmkelley" target="_blank"></a>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-12 col-lg-4 pt-5 pb-4 text-center text-lg-left">
                        <a href="#" onClick={ e => e.preventDefault() } className="d-inline-block" style={{ maxWidth: "300px" }}>
                            <img src="/static/images/Ideology.jpg" width="100%" />
                            <h4 className="mt-3 mb-0">Ideology</h4>
                        </a>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-md-3">
                        <h4>Readings</h4>
                        <ul>
                            <li><i>Factfulness</i>, Hans Rosling</li>
                            <li><i>The Hitchhiker's Guide to the Galaxy</i>,<br/>Douglas Adams</li>
                            <li><i>I Know Why The Caged Bird Sings</i>,<br/>Maya Angelou</li>
                            <li><i>Anxious People</i>, Fredrik Backman</li>
                            <li><i>The Goal</i>, Eli Goldratt</li>
                        </ul>
                        <h4>Writings</h4>
                        <ul>
                            <li>Research</li>
                            <li>Selected work</li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
                        <h4>Media influences</h4>
                        <ul>
                            <li>National Public Radio (NPR)</li>
                            <li>The New York Times</li>
                            <li>Saturday Night Live (SNL)</li>
                        </ul>
                        <h4>Lifestyle</h4>
                        <ul>
                            <li>Music: Anderson .Paak and Ed Sheeran</li>
                            <li>Recently, I became a gamer</li>
                            <li>I prefer watching television in seasons</li>
                            <li>Conservation and minimalism</li>
                            <li>I like to cook and used to be a vegan</li>
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}


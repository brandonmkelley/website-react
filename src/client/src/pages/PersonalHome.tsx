
import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLocation } from 'react-router-dom'

import { layoutSlice } from '../slices/layout'

import './PersonalHome.css'

export default () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(layoutSlice.actions.desktopWithScroll())
    }, [location.pathname])

    return (
        <React.Fragment>
            <div id="banner"></div>

            <div className="container text-center pt-5 pb-5" style={{ fontSize: "1.4rem" }}>
                "<i>We can only see a short distance ahead, but we can see plenty there that needs to be done.</i>"
                <br/><br/>
                <span style={{ fontSize: '1.2rem' }}>Alan Turing in <i>Computing Machinery and Intelligence</i></span>
                <br/>
                <span style={{ fontSize: '1rem' }}><span>Turing, A. M. (1950). Computing Machinery and Intelligence. Mind, 59, 433–460. </span>
                    <a target="_blank" href="https://doi.org/10.1093/mind/LIX.236.433">https://doi.org/10.1093/mind/LIX.236.433</a></span>
            </div>

            <div className="bg-light" style={{ width: "100%" }}>
                <div className="container text-justify pt-5 pb-5">
                    Hello! Thank you for visiting my website. I am an engineer, friend, and problem solver in the solar industry.
                    I received my <b>B.S. in Computer Engineering</b> at California Polytechnic State University in
                    San Luis Obispo, California, with culminating work in <b>advanced computer architecture</b> and <b>human-computer
                    interaction</b>. I currently work as a Renewables Data Analyst in the Sustainable Solutions group
                    at the <a href="https://sustainablesolutions.duke-energy.com/" target="_blank">Duke Energy Corporation</a>.
                    I collaborate with peers to address contemporary issues with research and the application of advanced
                    technology. My favorite hobbies include reading, playing guitar, and changing my lifestyle.
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
                            <li>Computer Architecure</li>
                            <li>Human-computer Interaction</li>
                            <li>Embedded systems</li>
                            <li>Cloud services</li>
                        </ul>
                        <h4>Work Experience</h4>
                        <ul>
                            <li>Duke Energy Corporation</li>
                            <li>Cal Poly Corporation</li>
                            <li>Microsoft Corporation</li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
                        <h4>Projects</h4>
                        <ul>
                            <li>Solar site performance monitoring</li>
                            <li>FPGA processor using RiSC-16 ISA</li>
                            <li>Pipelining and prediction architectures</li>
                            <li>FMCW embedded radar processing</li>
                            <li>Robotics &amp; augmented environments</li>
                            <li>LTE security in automotive applications</li>
                        </ul>
                        <h4>Resources</h4>
                        <ul>
                            <li><a target="_blank" href="https://linkedin.com/in/14bmkelley">LinkedIn profile</a></li>
                            {/* <li><a target="_blank" href="~/files/Resume - Brandon Micale Kelley.pdf">Downloadable resume</a></li> */}
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
                        <h4>Team Involvement</h4>
                        <ul>
                            <li>Cal Poly Computer Engineering Dept</li>
                            <li>HackingEDU</li>
                            <li>SLO Hacks</li>
                            <li>Sigma Phi Delta Engineering Fraternity</li>
                        </ul>
                        <h4>Events</h4>
                        <ul>
                            <li>ASFP Out of the Darkness walk</li>
                            <li>Food bank volunteering</li>
                            <li>Grid Alternatives solar installation</li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
                        <h4>Locations</h4>
                        <ul>
                            <li>Seattle, WA</li>
                            <li>Whidbey Island, WA</li>
                            <li>Bay Area, CA</li>
                            <li>San Luis Obispo, CA</li>
                            <li>Orange County, CA (current)</li>
                        </ul>
                        <h4>Online</h4>
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
                            <li><i>The Hitchhiker's Guide to the Galaxy</i>, Douglas Adams</li>
                            <li><i>A Life in Parts</i>, Bryan Cranston</li>
                            <li><i>Anxious People</i>, Fredrik Backman</li>
                            <li><i>Zen and the Art of Motorcycle Maintanence</i>, Robert Pirsig</li>
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
                            <li>Saturday Night Live (SNL)</li>
                            <li>Last Week Tonight with John Oliver</li>
                        </ul>
                        <h4>Lifestyle</h4>
                        <ul>
                            <li>Musical interests and performance</li>
                            <li>Streaming and filmography</li>
                            <li>E-Sports and online gaming</li>
                            <li>Water and material conservation</li>
                            <li>Responsible diet, unique meals</li>
                            <li>Personal productivity</li>
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}


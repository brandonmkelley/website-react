
import React from 'react'

import { useSelector } from 'react-redux'

import './PersonalHome.css'

export default () => (
        <React.Fragment>
            
            <div id="banner"></div>

<div className="container text-center pt-5 pb-5" style={{ fontSize: "1.4rem" }}>
    "<i>We can only see a short distance ahead, but we can see plenty there that needs to be done.</i>"
    <br/>~ Alan Turing
</div>


<div className="bg-light" style={{ width: "100%" }}>
    <div className="container text-justify pt-5 pb-5">
        Hello! Thank you for visiting my website. I am a university graduate, friend, and innovator in the tech industry.
        I received a <b>B.S. in Computer Engineering</b> at California Polytechnic State University in
        San Luis Obispo, California, culminating in <b>advanced computer architecture</b> and <b>human-computer
        interaction</b> research topics. I currently work as a Systems Analyst / Developer at
        <a href="https://recsolar.com/" target="_blank">REC Solar Commercial Corporation</a>.
        I collaborate with peers to address societal problems through research and the application of modern
        technology. My favorite hobbies include playing guitar, networking, and changing my lifestyle.
        Please feel free to <a href="/contact">contact me</a>.
    </div>
</div>


<div className="container">
    <div className="row">
        <div className="col-12 col-lg-4 pt-5 pb-4 text-center text-lg-left">
            <a href="#" onClick={() => console.log('Engineering clicked!')} style={{ display: "inline-block", maxWidth: "300px" }}>
                <img src="/images/REC Solar Headshot - Resized.png" width="100%" />
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
                <li>REC Solar Commercial Corporation</li>
                <li>Stellar Exploration, Inc.</li>
                <li>Cal Poly Corporation</li>
                <li>Microsoft Corporation</li>
            </ul>
        </div>
        <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
            <h4>Projects</h4>
            <ul>
                <li>FPGA processor using RiSC-16 ISA</li>
                <li>Pipelining and prediction architectures</li>
                <li>FMCW embedded radar processing</li>
                <li>Autonomous robotics courseware</li>
                <li>Augmented autonomous robotics</li>
                <li>LTE security in automotive applications</li>
            </ul>
            <h4>Resources</h4>
            <ul>
                <li><a target="_blank" href="https://linkedin.com/in/14bmkelley">LinkedIn profile</a></li>
                <li><a target="_blank" href="~/files/Resume - Brandon Micale Kelley.pdf">Downloadable resume</a></li>
            </ul>
        </div>
    </div>
    <hr />
    <div className="row">
        <div className="col-12 col-lg-4 pt-5 pb-4 text-center text-lg-right order-lg-last">
            <a href="#" onClick={() => console.log('Community clicked!')} className="d-inline-block" style={{ maxWidth: "300px" }}>
                <img src="/images/foodbank.jpg" width="100%" />
                <h4 className="mt-3 mb-0">Community</h4>
            </a>
        </div>
        <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-md-3">
            <h4>Team Involvement</h4>
            <ul>
                <li>Scientific Cal Ag</li>
                <li>Cal Poly Computer Engineering Dept.</li>
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
                <li>San Luis Obispo, CA</li>
                <li>Bay Area, CA</li>
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
            <a href="#" onClick={ () => console.log('Ideology clicked!') } className="d-inline-block" style={{ maxWidth: "300px" }}>
                <img src="/images/Ideology.jpg" width="100%" />
                <h4 className="mt-3 mb-0">Ideology</h4>
            </a>
        </div>
        <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-md-3">
            <h4>Readings</h4>
            <ul>
                <li>Contemporary Moral Problems</li>
                <li>Self, Media, and Society</li>
                <li><i>Sick: A Memoir</i>, Porochista Khakpour</li>
                <li><i>Hit Refresh</i>, Satya Nadella</li>
                <li><i>Mountains Beyond Mountains</i>, Tracy Kidder</li>
            </ul>
            <h4>Writings</h4>
            <ul>
                <li>Research</li>
                <li>Selected assignments</li>
                <li>Technology</li>
            </ul>
        </div>
        <div className="col-12 col-md-6 col-lg-4 pt-md-5 pb-3">
            <h4>Lifestyle</h4>
            <ul>
                <li>Musical interests and performance</li>
                <li>Water and material conservation</li>
                <li>Eating vegan</li>
                <li>Engineering personal productivity</li>
            </ul>
            <h4>Media influences</h4>
            <ul>
                <li>Trevor Noah</li>
                <li>John Oliver</li>
                <li>National Public Radio (NPR)</li>
                <li>Wall Street Journal</li>
            </ul>
        </div>
    </div>
</div>

        </React.Fragment>
    )


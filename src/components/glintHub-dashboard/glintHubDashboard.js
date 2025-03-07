import React from "react";
import { Link, withRouter } from "react-router-dom";
import Modal from "./Modal";
import AddApp from "../../assets/images/plus.png";
import noProject from "../../assets/images/no-project.png"; // Used when user have no projects
import ProjectCard from "../projectCard"


class GlintHubDashboard extends React.Component {
    state = {
        user: this.props.user,
        modalApp: null,
        modalIsOpen: false,
    }

    modalClick = (app) => {
        console.log(app)
        this.setState(() => ({
            modalApp: app,
            modalIsOpen: true,
        }))
    }

    closeModal = () => {
        this.setState(() => ({ modalIsOpen: false }))
    }

    render() {
        let { url } = this.props.match
        let { publishedProjects, draftedProjects, reviewProjects } = this.props.projects
        return (publishedProjects.length > 0 || draftedProjects.length > 0 || reviewProjects.length > 0) ? (
            <div id="glinthubDashboard">
                <h1>Dashboard</h1>
                <div className="dash-container-1 glinthub-dashboard-bold">
                    {/* upper boxes */}
                    <div className="bx-1">
                        <div className="up-bx">Published Apps</div>
                        <div className="dash-num">{publishedProjects.length}</div>
                    </div>

                    <div className="bx-1 bx-clr-2">
                        <div className="up-bx">Drafted Apps</div>
                        <div className="dash-num">{draftedProjects.length}</div>
                    </div>

                    <div className="bx-1 bx-clr-3">
                        <div className="up-bx">In-Review Apps</div>
                        <div className="dash-num">{reviewProjects.length}</div>
                    </div>
                </div>

                {publishedProjects.length > 0 && <div className="dash-container-2">
                    {/* <!-- Upper part --> */}
                    <div className="dashUp-1">
                        <span id="pr">Published Apps</span>
                        <Link to={`${url}/publishedApp`}><span id="vie">View All</span></Link>
                    </div>

                    <div className="projectDashboardGrid">
                        {publishedProjects.map((app) => {
                            return (
                                <div className="grid-column" key={app.id} onClick={() => { this.modalClick(app) }}>
                                    <ProjectCard project={app} />
                                    </div>
                            )
                        })}
                    </div>
                </div>}
                {draftedProjects.length > 0 && <div className="dash-container-2">
                    {/* <!-- Upper part --> */}
                    <div className="dashUp-1">
                        <span id="pr">Drafted Apps</span>
                        <Link to={`${url}/draftedApp`}><span id="vie">View All</span></Link>
                    </div>

                    <div className="projectDashboardGrid">
                        {draftedProjects.map((app) => {
                            return (
                                <div className="grid-column" key={app.id} onClick={() => { this.modalClick(app) }}>
                                <ProjectCard project={app} />
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {reviewProjects.length > 0 && <div className="dash-container-2">
                    {/* <!-- Upper part --> */}
                    <div className="dashUp-1">
                        <span id="pr">In-review Apps</span>
                        <Link to={`${url}/reviewApp`}><span id="vie">View All</span></Link>
                    </div>

                    <div className="projectDashboardGrid">
                        {reviewProjects.map((app) => {
                            return (
                                <div className="grid-column" key={app.id} onClick={() => { this.modalClick(app) }}>
                                <ProjectCard project={app} />
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {this.state.modalIsOpen && <Modal modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} user={this.props.user} projects={this.props.projects} modalApp={this.state.modalApp} />}
            </div>
        ) : (
            <div id="glinthubDashboard">
                <h1>Dashboard</h1>
                <h2 className="cl-font-grey">You don’t have added any project yet.</h2>
                <img id="no-project-img" src={noProject} />
                <br />
                <div className="addProject">
                    <Link to={`${url}/addApp`} className="img-icn-plus no-project-add" ><img src={AddApp} width="33px" height="31px" alt="Add App" /></Link><span className="h3 cl-darkGreen fw-700">Add Project</span>
                </div>
            </div>);
    }
}


export default withRouter(GlintHubDashboard)
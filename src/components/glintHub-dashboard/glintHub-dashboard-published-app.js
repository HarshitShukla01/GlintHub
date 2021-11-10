import React from "react";
import EditButton from "../../assets/images/edit.png";
import { connect } from "react-redux";
import { appsInit, setPublishedApp, setDraftedApp, setReviewApp } from "../actions";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from "@firebase/firestore";
import { Firestore } from "../../firebase";
import Spinner from "../spinner/Spinner";
import Modal from "react-modal";

class GlintHubDraftedApp extends React.Component {
    state = {
        user: this.props.currentUser,
        totalProjects: null,
        publishedApps: [],
        draftedApps: [],
        reviewApps: [],
        firstLoad: true,
        modalApp: null,
        modalIsOpen: false,
        title: '',
        technology: '',
        githubURL: '',
        imageURL: '',
        description: '',
        modalLoading: true,
        modalLoaded: false,
        isMounted: true
    }

    componentDidMount() {
        if (this.state.isMounted) {
            this.initAgain()
        }
    }

    initAgain = () => {
        this.props.appsInit()
        this.setState(() => {
            return {
                publishedApps: [],
                draftedApps: [],
                reviewApps: []
            }
        })
        const Query = query(collection(Firestore, "Users", this.state.user.uid, "Projects"), orderBy("timestamp", "desc"))
        onSnapshot(Query, (snapshot) => {
            snapshot.docs.map((doc) => {
                if (doc.data().inReview) {
                    this.props.setReviewApp(doc.data())
                    this.setState((prevState) => {
                        return {
                            reviewApps: [
                                ...prevState.reviewApps,
                                doc.data()
                            ]
                        }
                    })
                } else if (doc.data().isDrafted) {
                    this.props.setDraftedApp(doc.data())
                    this.setState((prevState) => {
                        return {
                            draftedApps: [
                                ...prevState.draftedApps,
                                doc.data()
                            ]
                        }
                    })
                } else if (doc.data().isPublished) {
                    this.props.setPublishedApp(doc.data())
                    this.setState((prevState) => {
                        return {
                            publishedApps: [
                                ...prevState.publishedApps,
                                doc.data()
                            ]
                        }
                    })
                }
            })
            this.setState(() => {
                return {
                    totalProjects: snapshot.docs.length
                }
            })
        });
    }

    componentDidUpdate() {
        if (this.state.isMounted) {
            let { publishedApps, draftedApps, reviewApps, totalProjects, firstLoad, modalLoaded } = this.state
            if (totalProjects == publishedApps.length + reviewApps.length + draftedApps.length && firstLoad) {
                this.setState(() => {
                    return {
                        firstLoad: false
                    }
                })
            }
            if (modalLoaded) {
                this.onModalLoad()
            }
        }
    }

    componentWillUnmount() {
        this.state.isMounted = false;
    }

    modalClick = (app) => {
        this.setState(() => {
            return {
                modalApp: app,
                modalIsOpen: true,
                modalLoading: false,
                modalLoaded: true
            }
        })
    }

    handleChange = (event) => {
        this.setState(() => {
            return {
                [event.target.name]: event.target.value
            }
        })
    }

    closeModal = () => {
        this.setState(() => {
            return {
                modalIsOpen: false
            }
        })
    }

    handleDeleteModal = async () => {
        let { user, modalApp } = this.state
        await deleteDoc(doc(Firestore, "Users", user.uid, "Projects", modalApp.id))
        this.initAgain()
        this.closeModal()
    }

    onModalLoad = () => {
        console.log(this.state.modalApp)
        this.setState(() => {
            return {
                modalLoaded: false,
                title: this.state.modalApp.title,
                technology: this.state.modalApp.technology,
                description: this.state.modalApp.description,
                githubURL: this.state.modalApp.githubURL,
                imageURL: this.state.modalApp.imageURL
            }
        })
    }

    render() {
        let { publishedApps, firstLoad, modalIsOpen, title, description, githubURL, imageURL, technology, modalLoading } = this.state
        return firstLoad ? <Spinner /> : (
            <div id="glinthub-dashboard-published-app">
                <h1 className="upper-h1">Published Apps</h1>
                <hr id="draft-line" />
                <div className="publish-apps-wrapper">
                    <div className="line1">
                        {publishedApps.map((app) => {
                            return (
                                    <div className="app-card" key={app.id}  onClick={() => { this.modalClick(app) }}>
                                        <div className="left-side">
                                            <img src={app.imageURL} alt="" />
                                            <p>{app.title}</p>
                                        </div>
                                        <div className="right-side">
                                            <p>{app.description}</p>

                                            <p className="type-android">{app.technology}</p>
                                        </div>
                                    </div>
                            )
                        })}
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={this.closeModal}
                            ariaHideApp={false}
                        >
                            {modalLoading ? "Loading" : (<div><div>Update App</div>
                                <div>
                                    <input type="text" name="title" value={title} onChange={this.handleChange} />
                                    <input type="text" name="technology" value={technology} onChange={this.handleChange} />
                                    <input type="text" name="description" value={description} onChange={this.handleChange} />
                                    <input type="text" name="imageURL" value={imageURL} onChange={this.handleChange} />
                                    <input type="text" name="githubURL" value={githubURL} onChange={this.handleChange} />
                                </div>
                                <div>
                                    <button onClick={this.handleDeleteModal}>Delete App</button>
                                    <button onClick={this.closeModal}>Close</button>
                                </div></div>)}
                        </Modal>
                        </div>
                </div>
            </div>
        );
    }
}

export default connect(null, { appsInit, setPublishedApp, setDraftedApp, setReviewApp })(GlintHubDraftedApp)
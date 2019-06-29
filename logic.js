
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            displaying: "create",
            tasks: [],
        }
        this.alternate = this.alternate.bind(this);
        this.addTask = this.addTask.bind(this);

    }
    componentWillMount() {
        var tasks = localStorage.getItem("tasks");
        tasks = JSON.parse(tasks);
        if (tasks != null) {
            this.setState({
                tasks
            })
        }
    }
    componentWillUpdate() {
        var tasks = this.state.tasks;
        var tasks = JSON.stringify(tasks);
        localStorage.setItem("tasks", tasks)
    }
    addTask(task) {
        var tasks = this.state.tasks.slice();
        tasks.push(task);
        this.setState({
            tasks
        })
        //add index to the task (used for editing the task later on)

    }
    alternate(phase) {
        this.setState({
            displaying: phase
        });
    }
    render() {
        return (
            <div className="container">
                <Sidebar alternateFunction={this.alternate}/>
                <div className="main-content" >
                    {
                        this.state.displaying == "create" ? <Create addToTasks={this.addTask}/> : <Manage tasks={this.state.tasks} />
                    }
                </div>
            </div>

        );
    }
}
class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.callAlternate = this.callAlternate.bind(this);
    }
    callAlternate(phase) {
        this.props.alternateFunction(phase)
    }
    render() {
        return (
            <div className="sidebar">
                <div className="links" onClick={() => this.callAlternate("create") } >
                    Create task
                </div>
                <div className="links" onClick={() => this.callAlternate("manage") }>
                    Manage tasks
                </div>
            </div>
        )
    }
}

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionOfJustice: [],
            collectionOfSpecks: [],
            task: {},
        }
        this.addInfo = this.addInfo.bind(this)
        this.displayInfo = this.displayInfo.bind(this)
        this.create = this.create.bind(this)
    }
    addInfo(type) {
        if (type == "just") {
            var element = this.justification.value
            var arrayOfJustifications = this.state.collectionOfJustice.slice();
            arrayOfJustifications.push(element);
            this.setState({
                collectionOfJustice: arrayOfJustifications
            })
            this.justification = "";

        } else if (type == "speck") {
            var element = this.specification.value
            var arrayOfSpecks = this.state.collectionOfSpecks.slice();
            arrayOfSpecks.push(element);
            this.setState({
                collectionOfSpecks: arrayOfSpecks
            })
            this.specification = "";

        }

    }
    clearInputs() {
        var fields = document.getElementsByClassName("inputs");
        for (var i = 0; i < fields.length; i++) {
            fields[i].value = "";
        }
    }


    create() {
        var date = this.getDate()
        var taskObject = {
            project: this.projectName.value,
            name: this.name.value,
            justification: [...this.state.collectionOfJustice, this.justification.value],
            taskDescription: this.description.value,
            taskSpecification: [...this.state.collectionOfSpecks, this.specification.value],
            status: "new",
            date: date
        }
        this.name.value = ""
        this.props.addToTasks(taskObject);

        this.clearInputs()
        this.setState({
            collectionOfJustice: [],
            collectionOfSpecks: []
        })

    }
    getDate() {
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = dd + '/' + mm + '/' + yyyy;
        return date
    }
    displayInfo(type) {
        var arrayOfElements = [];
        type == "just" ? arrayOfElements = this.state.collectionOfJustice : arrayOfElements = this.state.collectionOfSpecks;
        arrayOfElements = arrayOfElements.map((element) => {
            return (
                <LittleOne className="single-argument" key={`name:${element}`} text={element}/>

            )
        })
        return arrayOfElements

    }



    render() {
        return (
            <div className="create">
                <div className="create-wrapper">
                    <h4>Project Title</h4>
                    <input className=" inputs task-project" type="text" placeholder="Which project is it a part of" ref={(input) => this.projectName = input}/>
                    <h4>Task Title</h4>
                    <input className=" inputs task-name" type="text" placeholder="name of task" ref={(input) => this.name = input} />
                    <h4>Justifications</h4>
                    <input className="inputs task-justification" placeholder="justification of task" ref={(input) => this.justification = input} />
                    <button className="add-info" onClick={() => this.addInfo("just") }>+</button>
                    <div className="display-form justice" id="justice-box">
                        {this.displayInfo("just") }
                    </div>
                    <h4> Description</h4>
                    <textarea className="inputs task-description" placeholder="description of task" ref={(input) => this.description = input}>
                    </textarea>
                    <h4>Specifications</h4>
                    <input className=" inputs task-spec" placeholder="specification of task"  ref={(input) => this.specification = input}/>
                    <button className="add-info" onClick={() => this.addInfo("speck") }>+</button>
                    <div className="display-form speck" id="speck-box">
                        {this.displayInfo("speck") }
                    </div>
                    <input type="submit" className="submit" onClick={() => this.create() } />
                </div>
            </div>
        )
    }
}
class LittleOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0
        }
        this.callToDelete = this.callToDelete.bind(this)

    }
    callToDelete() {
        console.log(this.props.callToDelete)
        if (this.props.callToDelete != undefined) {
            var counter = this.state.counter;
            counter++;
            counter >= 2 ? this.props.callToDelete(this.props.text) : this.setState({ counter })

        }
        return false
        // I also only want this to be called if the function has this props but I cannot remember the best way to do this- google?
        //I'm starting to feel more comfotable with react and this is pretty cool, I hope to understand it better though, and to really b able to use it's like potential. 


    }
    render() {
        return (

            <div className="single-argument" onClick={this.callToDelete}>
                {this.props.text}
            </div>
        )
    }

}
class Manage extends React.Component {
    constructor(props) {
        super(props)

        this.renderTasks = this.renderTasks.bind(this)
    }
    renderTasks() {
        return this.props.tasks.map((task) => {
            return (
                <ListElement
                    key={task.id}
                    task={task}
                    />
            )
        })
    }
    render() {
        return (
            <div className="manage" >
                <div className="tasks-table">
                    <div className="table-titles">
                        <div className="col-title">
                            Task-title
                        </div>
                        <div className="col-title">
                            Project:
                        </div>
                        <div className="col-title">
                            Status
                        </div>
                        <div className="col-title">
                            Date:
                        </div>
                    </div>
                    {
                        this.renderTasks()
                    }
                </div>
            </div>
        )
    }
}

class ListElement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayInfo: false
        }
        this.toggleTaskDisplay = this.toggleTaskDisplay.bind(this)
    }
    toggleTaskDisplay() {
        this.setState({
            displayInfo: !this.state.displayInfo
        })
    }
    render() {
        return (
            <div className="task-wrapper" >
                <div className="table-row"  >
                    <div className="table-col" >
                        {this.props.task.name}
                    </div>
                    <div className="table-col">
                        {this.props.task.project}
                    </div>
                    <div className="table-col">
                        <div className={`status ${this.props.task.status}`}>
                        </div>
                    </div>
                    <div className="table-col">
                        {this.props.task.date}
                    </div>
                    <button onClick={() => this.toggleTaskDisplay() }> +</button>
                </div>
                {this.state.displayInfo ? <DescriptiveContainer task={this.props.task}/> : null}

            </div>
        )
    }


}
class DescriptiveContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enableEditing: false
        }
        this.enableEdit = this.enableEdit.bind(this)
    }
    enableEdit() {
        this.setState({
            enableEditing: !this.state.enableEditing
        })
    }
    render() {

        return (
            <div className="ninety">
                {!this.state.enableEditing ? <DescriptiveBox task={this.props.task} callEnableEdit={this.enableEdit}/> : <EditingBox task={this.props.task} callEnableEdit={this.enableEdit}/>}
            </div>
        )
    }
}

class DescriptiveBox extends React.Component {
    constructor(props) {
        super(props)
        this.enableEdit = this.enableEdit.bind(this)
        this.displayInfo = this.displayInfo.bind(this)

    }
    enableEdit() {
        this.props.callEnableEdit()
    }
    displayInfo(type) {
        var arrayOfElements = [];
        type == "just" ? arrayOfElements = this.props.task.justification : arrayOfElements = this.props.task.taskSpecification;
        if (arrayOfElements[0] == "") {
            return false
        } else {
            arrayOfElements = arrayOfElements.map((element) => {
                return (
                    <LittleOne className="single-argument" key={`name:${element}`} text={element} callToDelete={this.deleteLilOne}/>
                )
            })
            return arrayOfElements
        }
    }
    render() {

        return (

            <div className="task-panel" id={`#${this.props.task.id}`}>
                <div>
                    <h4 className="heading">Justifications: </h4>
                    {this.displayInfo("just") }

                </div>
                <div>
                    <h4 className="heading">Description: </h4>
                    {this.props.task.taskDescription}

                </div>
                <div>
                    <h4 className="heading">Specifications: </h4>
                    {this.displayInfo("speck") }
                </div>
                <div>
                    <button onClick={this.enableEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

class EditingBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            specks: this.props.task.taskSpecification,
            justies: this.props.task.justification,

        }
        this.deleteLilOne = this.deleteLilOne.bind(this)
        this.enableEdit = this.enableEdit.bind(this)
        this.editTask = this.editTask.bind(this)
    }
    deleteLilOne(textOfLilOne) {
        var specks = this.state.specks;
        var justies = this.state.justies;
        console.log(specks)
        console.log(justies)
        console.log(textOfLilOne)
        console.log(justies.indexOf(textOfLilOne))
        if (justies != undefined) {
            if (justies.indexOf(textOfLilOne) != -1) {
                console.log("entered")
                var index = justies.indexOf(textOfLilOne);
                justies.splice(index, 1)
            }
        }
        if (specks != undefined) {
            if (specks.indexOf(textOfLilOne) != -1) {
                var index = specks.indexOf(textOfLilOne);
                specks.splice(index, 1)
            }

        }

        this.setState({
            justies,
            specks
        })
    }
    editTask() {
        var taskObject = {
            project: this.props.task.project,
            name: this.props.task.name,
            justification: [...this.state.justies, this.justification.value],
            taskDescription: this.description.value,
            taskSpecification: [...this.state.specks, this.specification.value],
            status: this.status.value,
            date: this.props.task.date
        }
        console.log(this.status.value)
        console.log(this.props.task)
        console.log(taskObject)

        //this is unfinished over here. should send task in a call back to the create component, and replace the existing task. 
    }
    enableEdit() {
        this.editTask();
        this.props.callEnableEdit()
    }
    addLilOne(type) {
        if (type == "just") {
            var element = this.justification.value
            var arrayOfJustifications = this.state.justies.slice();
            arrayOfJustifications.push(element);
            this.setState({
                justies: arrayOfJustifications
            })
            this.justification = "";

        } else if (type == "speck") {
            var element = this.specification.value
            var arrayOfSpecks = this.state.specks.slice();
            arrayOfSpecks.push(element);
            this.setState({
                specks: arrayOfSpecks
            })
            this.specification = "";
        }
        console.log(element)
    }
    displayInfo(type) {
        var arrayOfElements = [];
        type == "just" ? arrayOfElements = this.state.justies : arrayOfElements = this.state.specks;
        if (arrayOfElements[0] == "") {
            return false
        } else {
            arrayOfElements = arrayOfElements.map((element) => {
                return (
                    <LittleOne className="single-argument" key={`name:${element}`} text={element} callToDelete={this.deleteLilOne}/>
                )
            })
            return arrayOfElements
        }
    }
    render() {

        return (

            <div className="task-panel" id={`#${this.props.task.id}`}>
                <div className="col">
                    Status:
                    <select ref={(input)=>this.status=input}>
                        <option value="new">new </option>
                        <option value="active">active</option>
                        <option value="hold">on hold</option>
                        <option value="completed">completed</option>
                    </select>
                </div>

                <div className="col">
                    <h4 className="heading">Justifications: </h4>
                    <input type="text" placeholder="double click to delete them or add new" ref={(input) => this.justification = input }/>
                    <button onClick={() => this.addLilOne("just") }>+</button>

                    <br/>
                    <div>
                        {this.displayInfo("just") }
                    </div>
                </div>
                <div>
                    <h4 className="heading">Description: </h4>
                    <textarea defaultValue={this.props.task.taskDescription} ref={(input) => this.description = input }></textarea>
                </div>
                <div className="col">
                    <h4 className="heading">Specifications: </h4>
                    <input type="text" placeholder=" double click to delete them or add new" ref={(input) => this.specification = input }/>
                    <button onClick={() => this.addLilOne("speck") }>+</button>
                    <br/>
                    <div>
                        {this.displayInfo("speck") }
                    </div>
                </div>
                <div>
                    <button onClick={this.enableEdit}>Done</button>
                </div>
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,
    document.getElementById("root")
);
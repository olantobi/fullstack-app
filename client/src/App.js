import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {

  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  }

  componentDidMount() {
    this.getDataFromDb()
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 10000)
      this.setState({ intervalIsSet: interval})
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null })
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }))
  }

  addDataToDb = (message) => {
    let currentIds = this.state.data.map((data) => data.id)
    let idToBeAdded = 0
    while (currentIds.includes(idToBeAdded)) {
        ++idToBeAdded
    }

    axios.post('http://localhost:3001/api/createData', {
      id: idToBeAdded,
      message: message
    })
  }

  deleteFromDb = (idToDelete) => {
    idToDelete = parseInt(idToDelete)
    let objIdToDelete = null
    this.state.data.forEach((dat) => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id
      }
    })

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete
      }
    })
  }

  updateDb = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null
    idToUpdate = parseInt(idToUpdate)
    console.log("ID in Q", idToUpdate)
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id
      }
    })

    console.log("Mongo ID to update", objIdToUpdate)

    axios.put('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply }
    })
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {
            data.length <= 0 ? 'No database entries yet' 
              : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.message}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}>data: </span> {dat.message}
                </li>
            ))
          }      
        </ul>

        <div style={{ padding: '10px' }}>
          <input type="text" onChange={(e) => this.setState({ message: e.target.value })} 
            placeholder="add something in the database" style={{ width: '200px' }} />

          <button onClick={() => this.addDataToDb(this.state.message)}>Add</button>
        </div>

        <div style={{ padding: '10px' }}>
          <input type="text" onChange={(e) => this.setState({ idToDelete: e.target.value })} 
            placeholder="id of item to delete here" style={{ width: '200px' }} />

          <button onClick={() => this.deleteFromDb(this.state.idToDelete)}>Delete</button>
        </div>

        <div style={{ padding: '10px' }}>
          <input type="text" onChange={(e) => this.setState({ idToUpdate: e.target.value })} 
            placeholder="id of item to update" style={{ width: '200px' }} />

          <input type="text" onChange={(e) => this.setState({ updateToApply: e.target.value })} 
            placeholder="New value of item here" style={{ width: '200px' }} />

          <button onClick={() => this.updateDb(this.state.idToUpdate, this.state.updateToApply)}>Update</button>
        </div>
      </div>
    );
  }
}

export default App;

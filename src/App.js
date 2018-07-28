import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';



const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'Signin',
  isSignedIn: false,
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initState;
  }

/*  componentDidMount() {
    fetch('https://afternoon-sierra-22942.herokuapp.com/')
      .then(response => response.json())
      .then(res => {
        console.log('componentDidMount response', res);
      });
  }*/

  calculateFaceLocation = (data) => {
    const clarifiaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifiaiFace.left_col * width,
      topRow: clarifiaiFace.top_row * height,
      rightCol: width - (clarifiaiFace.right_col * width),
      bottomRow: height - (clarifiaiFace.bottom_row * height)
    };
  }

  loadUser = (data) => {
    this.setState({user: {
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
      fetch('https://afternoon-sierra-22942.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          fetch('https://afternoon-sierra-22942.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'Signout'){
      this.setState(initState);
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
            params={particlesOptions}
          />
        <Navigation 
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>      
              <FaceRecognition 
                imageURL={this.state.imageURL}
                box={this.state.box}/>
            </div>
          : ( this.state.route === 'Signin'
            ? <Signin loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;

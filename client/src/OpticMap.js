import React, { Component } from "react";
import { Map, View } from "ol";
// import getPixelFromCoordinate from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, transformExtent, transform } from "ol/proj";
import "./OpticMap.css";
import { Stroke, Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Control, defaults } from "ol/control";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LineString from "ol/geom/LineString";
// import switchesArray from "./res/switches.json";
// import opticsArray from "./res/optics.json";
// import clientStationsArray from "./res/clientStations.json";

import clientStationIcon from "./img/client_station_icon.png";
import switchIcon from "./img/switch_icon.png";

class OpticMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      coordinates: "coordinates",
      currentForm: null,
      formItemType: null,
      displayedFeatures: null,
      featureInfo: {
        featureCoordinates: null,
        address: null,
        ipAddress: null,
        info: null,
        locationInfo: null,
      },
      switchesContainerArray: null,
      opticsContainerArray: null,
      clientStationsContainerArray: null,
    };

    this.addButton = this.handleAddButton.bind(this);

    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleAddSubmit = this.handleAddSubmit.bind(this);

    this.handleZoom = this.handleZoom.bind(this);

    this.setSwitchesToRightControlPanel = this.setSwitchesToRightControlPanel.bind(
      this
    );

    this.setOpticsToRightControlPanel = this.setOpticsToRightControlPanel.bind(
      this
    );

    this.setClientStationsToRightControlPanel = this.setClientStationsToRightControlPanel.bind(
      this
    );

    this.initMapComponent = this.initMapComponent.bind(this);

    this.changeFeaturesSize = this.changeFeaturesSize.bind(this);

    this.getFeatureInfo = this.getFeatureInfo.bind(this);
    this.getfeatureInfoBlock = this.getfeatureInfoBlock.bind(this);

    this.getEditingOrAddingForm = this.getEditingOrAddingForm.bind(this);

    this.addNewSwitch = this.addNewSwitch.bind(this);
    this.deleteSwitch = this.deleteSwitch.bind(this);
    this.editSwitchInfo = this.editSwitchInfo.bind(this);

    this.addOptics = this.addOptics.bind(this);
    this.deleteOptics = this.deleteOptics.bind(this);
    this.editOptics = this.editOptics.bind(this);

    this.addNewClientStation = this.addNewClientStation.bind(this);
    this.deleteClientStation = this.deleteClientStation.bind(this);
    this.editClientStationInfo = this.editClientStationInfo.bind(this);

    this.areFieldsValid = this.areFieldsValid.bind(this);
  }

  //
  //switch control methods
  addNewSwitch(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/addSwitch", options).then(() => {
      this.initMapComponent();
    });
  }

  editSwitchInfo(itemToReplace, newItem) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([itemToReplace, newItem]),
    };
    fetch("/api/editSwitch", options);
  }

  deleteSwitch(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/deleteSwitch", options).then(() => {
      this.initMapComponent();
    });
  }
  //
  //

  //
  //client stations control methods
  addNewClientStation(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/addClientStation", options).then(() => {
      this.initMapComponent();
    });
  }

  editClientStationInfo(itemToReplace, newItem) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([itemToReplace, newItem]),
    };
    fetch("/api/editClientStation", options).then(() => {
      this.initMapComponent();
    });
  }

  deleteClientStation(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/deleteClientStation", options).then(() => {
      this.initMapComponent();
    });
  }
  //
  //

  //
  //optic cable control methods
  addOptics(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/addOptics", options).then(() => {
      this.initMapComponent();
    });
  }

  editOptics(itemToReplace, newItem) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([itemToReplace, newItem]),
    };
    fetch("/api/editOptics", options).then(() => {
      this.initMapComponent();
    });
  }

  deleteOptics(data) {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/deleteOptics", options).then(() => {
      this.initMapComponent();
    });
  }
  //
  //

  initMapComponent() {
    let switchFeatureArray = [];
    let opticsFeatureArray = [];
    let clientStationsFeatureArray = [];

    //get switches from server
    fetch("/api/switches")
      .then((res) => res.json())
      .then((switches) => {
        switches.map((data) => {
          let featureElement = new Feature({
            geometry: new Point(fromLonLat(data.coordinates)),
            featureType: "switch",
            address: data.address,
            ipAddress: data.ipAddress,
            info: data.info,
            locationInfo: data.locationInfo,
            featureCoordinates: data.coordinates,
          });
          switchesLayerSource.addFeature(featureElement);

          switchFeatureArray.push(featureElement);
          this.setState({ switchesContainerArray: switchFeatureArray });
        });
      });

    //get optics from server
    fetch("/api/optics")
      .then((res) => res.json())
      .then((optics) =>
        optics.map((data) => {
          let coordinatesArray = [];
          data.coordinates.map((coordinate) => {
            coordinatesArray.push(fromLonLat(coordinate));
          });

          let featureElement = new Feature({
            geometry: new LineString(coordinatesArray),
            featureType: "optics",
            address: data.address,
            ipAddress: data.ipAddress,
            info: data.info,
            locationInfo: data.locationInfo,
            featureCoordinates: data.coordinates,
          });

          opticsLayerSource.addFeature(featureElement);

          opticsFeatureArray.push(featureElement);
          this.setState({
            opticsContainerArray: opticsFeatureArray,
          });
        })
      );

    fetch("/api/clientStations")
      .then((res) => res.json())
      .then((clientStations) => {
        clientStations.map((data) => {
          let featureElement = new Feature({
            geometry: new Point(fromLonLat(data.coordinates)),
            featureType: "clientStation",
            address: data.address,
            ipAddress: data.ipAddress,
            info: data.info,
            locationInfo: data.locationInfo,
            featureCoordinates: data.coordinates,
          });
          clientStationsLayerSource.addFeature(featureElement);

          clientStationsFeatureArray.push(featureElement);
          this.setState({
            clientStationsContainerArray: clientStationsFeatureArray,
          });
        });
      });

    const extentView = transformExtent(
      [
        20.969893 /** min x */,
        57.540673 /** min y */,
        28.413477 /** max x */,
        59.894102 /** max y */,
      ],
      "EPSG:4326",
      "EPSG:3857"
    );
    const extentLayer = transformExtent(
      [
        16.581885 /** min x */,
        55.671002 /** min y */,
        32.794556 /** max x */,
        61.543774 /** max y */,
      ],
      "EPSG:4326",
      "EPSG:3857"
    );

    const layerVisibilityControl = (function (Control) {
      function layerVisibilityControl(layerName, className, buttontext) {
        const button = document.createElement("button");
        button.innerHTML = buttontext;

        var element = document.createElement("div");
        element.className = className + " ol-unselectable ol-control";
        element.appendChild(button);

        Control.call(this, {
          element: element,
        });

        button.addEventListener(
          "click",
          this.handlelayerVisibilityControl.bind(this, layerName),
          false
        );
      }

      if (Control) layerVisibilityControl.__proto__ = Control;
      layerVisibilityControl.prototype = Object.create(
        Control && Control.prototype
      );
      layerVisibilityControl.prototype.constructor = layerVisibilityControl;

      layerVisibilityControl.prototype.handlelayerVisibilityControl = function handlelayerVisibilityControl(
        layerName
      ) {
        map
          .getLayers()
          .getArray()
          .map((layer) => {
            if (layer.getClassName() === layerName) {
              layer.setVisible(!layer.getVisible());
            }
          });
      };

      return layerVisibilityControl;
    })(Control);

    const map = new Map({
      target: this.refs.mapContainer,
      layers: [
        new TileLayer({
          source: new OSM(),
          extent: extentLayer,
          zIndex: 0,
        }),
      ],
      view: new View({
        center: fromLonLat([28.185281, 59.374348]),
        zoom: 14,
        extent: extentView,
        minZoom: 7.5,
      }),
      controls: defaults({
        attributionOptions: {
          target: this.refs.mapContainer,
        },
      }).extend([
        new layerVisibilityControl(
          "switchesLayer",
          "switches-visible",
          "switches"
        ),
        new layerVisibilityControl(
          "opticsLayer",
          "optics-visible",
          "optic cables"
        ),
        new layerVisibilityControl(
          "clientStationsLayer",
          "clientStations-visible",
          "client stations"
        ),
      ]),
    });

    let opticsLayerSource = new VectorSource({
      features: opticsFeatureArray,
    });

    this.opticsLayer = new VectorLayer({
      className: "opticsLayer",
      source: opticsLayerSource,
      visible: true,
      style: new Style({
        stroke: new Stroke({
          width: 2,
          color: "skyblue",
        }),
      }),
    });

    let clientStationsLayerSource = new VectorSource({
      features: clientStationsFeatureArray,
    });

    this.clientStationsLayer = new VectorLayer({
      className: "clientStationsLayer",
      source: clientStationsLayerSource,
      visible: true,
      style: new Style({
        image: new Icon({
          opacity: 1,
          src: clientStationIcon,
          scale: 0.09,
        }),
      }),
    });

    let switchesLayerSource = new VectorSource({
      features: switchFeatureArray,
    });

    this.switchesLayer = new VectorLayer({
      className: "switchesLayer",
      source: switchesLayerSource,
      visible: true,
      style: new Style({
        image: new Icon({
          opacity: 1,
          src: switchIcon,
          scale: 0.09,
        }),
      }),
    });

    //layers with network equipment

    //map feature settings

    //layers settings
    map.addLayer(this.clientStationsLayer);
    map.addLayer(this.switchesLayer);
    map.addLayer(this.opticsLayer);
    //layers settings
    //click on map
    map.on(
      "click",
      function (pointOfClick) {
        const clickedCoordinate = transform(
          pointOfClick.coordinate,
          "EPSG:3857",
          "EPSG:4326"
        );

        let coordinateString =
          clickedCoordinate[0].toFixed(6) +
          "," +
          clickedCoordinate[1].toFixed(6);
        this.setState({
          coordinates: coordinateString,
          featureCoordinates: coordinateString,
        });

        map.forEachFeatureAtPixel(
          pointOfClick.pixel,
          function (feature) {
            this.setState({
              currentForm: null,
              featureInfo: {
                featureCoordinates: feature.getProperties().featureCoordinates,
                address: feature.getProperties().address,
                ipAddress: feature.getProperties().ipAddress,
                info: feature.getProperties().info,
                locationInfo: feature.getProperties().locationInfo,
                featureContainerArray: feature.getProperties()
                  .featureContainerArray,
              },
            });
            this.state.map
              .getView()
              .animate({ center: fromLonLat(clickedCoordinate) }, { zoom: 19 });
          }.bind(this)
        );
      }.bind(this)
    );

    // change features size on zoom change
    map.getView().on("propertychange", (e) => {
      // switch (e.key) {
      //   case "resolution":
      //     this.handleZoom(map.getView().getZoom());
      //     break;
      // }
      if (e.key === "resolution") {
        this.handleZoom(map.getView().getZoom());
      }
    });

    this.setState({
      map: map,
    });
  }

  componentDidMount() {
    this.initMapComponent();
  }

  setSwitchesToRightControlPanel() {
    this.setState({
      displayedFeatures: this.state.switchesContainerArray,
    });
  }
  setOpticsToRightControlPanel() {
    this.setState({
      displayedFeatures: this.state.opticsContainerArray,
    });
  }
  setClientStationsToRightControlPanel() {
    this.setState({
      displayedFeatures: this.state.clientStationsContainerArray,
    });
  }

  handleRightPanelItemClick(item) {
    if (this.state.currentForm != null) {
      this.setState({
        currentForm: null,
        formItemType: null,
      });
    }

    let coordinatesForAnimation;
    let featureCoordinates = item.getProperties().featureCoordinates;

    if (Array.isArray(featureCoordinates[0])) {
      coordinatesForAnimation = featureCoordinates[0];
    } else {
      coordinatesForAnimation = featureCoordinates;
    }

    this.state.map.getView().animate(
      {
        center: fromLonLat(coordinatesForAnimation),
      },
      { zoom: 18.5 }
    );

    this.setState({
      featureInfo: {
        featureCoordinates: item.getProperties().featureCoordinates,
        address: item.getProperties().address,
        ipAddress: item.getProperties().ipAddress,
        info: item.getProperties().info,
        locationInfo: item.getProperties().locationInfo,
      },
    });
  }

  changeFeaturesSize(strokeWidth, iconsScale) {
    this.switchesLayer.setStyle(
      new Style({
        image: new Icon({
          opacity: 1,
          src: switchIcon,
          scale: iconsScale,
        }),
      })
    );
    this.opticsLayer.setStyle(
      new Style({
        stroke: new Stroke({
          width: strokeWidth,
          color: "skyblue",
        }),
      })
    );
    this.clientStationsLayer.setStyle(
      new Style({
        image: new Icon({
          opacity: 1,
          src: clientStationIcon,
          scale: iconsScale,
        }),
      })
    );
  }

  handleZoom(zoomSize) {
    if (zoomSize < 12) {
      this.changeFeaturesSize(0.5, 0.01);
    } else if (zoomSize < 13) {
      this.changeFeaturesSize(2, 0.05);
    } else if (zoomSize < 14) {
      this.changeFeaturesSize(2, 0.08);
    } else if (zoomSize < 16) {
      this.changeFeaturesSize(2, 0.1);
    } else if (zoomSize < 18) {
      this.changeFeaturesSize(4, 0.12);
    } else {
      this.changeFeaturesSize(7, 0.25);
    }
  }

  getFeatureInfo(featureInfo) {
    return featureInfo !== null ? (
      <div className="featureInfoElement">{featureInfo}</div>
    ) : (
      <div className="hidden"></div>
    );
  }
  getfeatureInfoBlock() {
    if (this.state.featureInfo.featureCoordinates !== null) {
      return (
        <div className="featureInfo">
          {this.getFeatureInfo(this.state.featureInfo.address)}
          {this.getFeatureInfo(this.state.featureInfo.ipAddress)}
          {this.getFeatureInfo(this.state.featureInfo.info)}
          {this.getFeatureInfo(this.state.featureInfo.locationInfo)}
          <div
            className="editButton"
            onClick={() => {
              this.setState({
                currentForm: "edit",
              });
            }}
          >
            Edit
          </div>
        </div>
      );
    } else {
      return <div className="hidden"></div>;
    }
  }

  handleEditSubmit = () => {
    let editedItem = {
      address: this.refs.addressFormField.value,
      locationInfo: this.refs.locationInfoFormField.value,
      ipAddress: this.refs.ipAddressFormField.value,
      info: this.refs.infoFormField.value,
      coordinates: this.refs.coordinateFormField.value.split(","),
    };
    let itemToEdit = {
      address: this.state.featureInfo.address,
      locationInfo: this.state.featureInfo.locationInfo,
      ipAddress: this.state.featureInfo.ipAddress,
      info: this.state.featureInfo.info,
      coordinates: this.state.featureInfo.featureCoordinates,
    };

    function transformCoordinates(coordinates) {
      let opticsCoordinates = [];
      // let formCoordinatesArray = coordinates.split(",");
      let arrayLenght = coordinates.length;

      let i = 0;
      while (i < arrayLenght) {
        opticsCoordinates.push(new Array(coordinates[i], coordinates[i + 1]));
        i++;
        i++;
      }
      return opticsCoordinates;
    }
    if (
      this.areFieldsValid({
        address: this.refs.addressFormField.value,
        locationInfo: this.refs.locationInfoFormField.value,
        info: this.refs.infoFormField.value,
        coordinates: this.refs.coordinateFormField.value,
      })
    ) {
      if (
        !Array.isArray(editedItem.coordinates[0]) &&
        !Array.isArray(itemToEdit.coordinates[0])
      ) {
        this.editSwitchInfo(itemToEdit, editedItem);
        this.editClientStationInfo(itemToEdit, editedItem);
      } else {
        this.editOptics(
          {
            address: this.state.featureInfo.address,
            locationInfo: this.state.featureInfo.locationInfo,
            ipAddress: this.state.featureInfo.ipAddress,
            info: this.state.featureInfo.info,
            coordinates: transformCoordinates(
              this.state.featureInfo.featureCoordinates
            ),
          },
          {
            address: this.refs.addressFormField.value,
            locationInfo: this.refs.locationInfoFormField.value,
            ipAddress: this.refs.ipAddressFormField.value,
            info: this.refs.infoFormField.value,
            coordinates: transformCoordinates(
              this.refs.coordinateFormField.value.split(",")
            ),
          }
        );
      }
      this.setState({
        currentForm: null,
        displayedFeatures: null,
        featureInfo: {
          featureCoordinates: null,
          address: null,
          ipAddress: null,
          info: null,
          locationInfo: null,
        },
      });
    }
  };

  handleDeleteButton = () => {
    let itemToDelete = {
      address: this.refs.addressFormField.value,
      locationInfo: this.refs.locationInfoFormField.value,
      ipAddress: this.refs.ipAddressFormField.value,
      info: this.refs.infoFormField.value,
    };

    this.deleteOptics({
      address: this.refs.addressFormField.value,
      locationInfo: this.refs.locationInfoFormField.value,
      ipAddress: this.refs.ipAddressFormField.value,
      info: this.refs.infoFormField.value,
    });
    this.deleteSwitch(itemToDelete);
    this.deleteClientStation(itemToDelete);

    this.setState({
      displayedFeatures: null,
      featureInfo: {
        featureCoordinates: null,
        address: null,
        ipAddress: null,
        info: null,
        locationInfo: null,
      },
    });
  };

  areFieldsValid(item) {
    let coordinatesArray = item.coordinates.split(",");
    coordinatesArray.map((coordinate) => {
      if (!Number.isFinite(Number(coordinate))) {
        console.log("Wrong coordinates format.");
        return false;
      }
    });
    if (
      item.address.trim() === "" ||
      item.locationInfo.trim() === "" ||
      item.info.trim() === ""
    ) {
      console.log("Only ip address field can be empty.");
      return false;
    } else {
      console.log("Values accepted!");
      return true;
    }
  }

  handleAddSubmit = () => {
    let itemType = this.state.formItemType;

    if (
      this.areFieldsValid({
        address: this.refs.addressFormField.value,
        locationInfo: this.refs.locationInfoFormField.value,
        info: this.refs.infoFormField.value,
        coordinates: this.refs.coordinateFormField.value,
      })
    ) {
      switch (itemType) {
        case "switch":
          let switchCoordinatesFromForm = this.refs.coordinateFormField.value.split(
            ","
          );
          if (!Array.isArray(switchCoordinatesFromForm[0])) {
            this.addNewSwitch({
              address: this.refs.addressFormField.value,
              locationInfo: this.refs.locationInfoFormField.value,
              ipAddress: this.refs.ipAddressFormField.value,
              info: this.refs.infoFormField.value,
              coordinates: this.refs.coordinateFormField.value.split(","),
            });
          } else {
            console.log("Wrong coordinates for switch.");
          }

          break;
        case "clientStation":
          let clientStationCoordinatesFromForm = this.refs.coordinateFormField.value.split(
            ","
          );
          if (!Array.isArray(clientStationCoordinatesFromForm[0])) {
            this.addNewClientStation({
              address: this.refs.addressFormField.value,
              locationInfo: this.refs.locationInfoFormField.value,
              ipAddress: this.refs.ipAddressFormField.value,
              info: this.refs.infoFormField.value,
              coordinates: this.refs.coordinateFormField.value.split(","),
            });
          } else {
            console.log("Wrong coordinates for client station.");
          }
          break;
        case "opticCable":
          let opticsCoordinates = [];
          let formCoordinatesArray = this.refs.coordinateFormField.value.split(
            ","
          );
          let arrayLenght = formCoordinatesArray.length;
          if (arrayLenght % 2 !== 0 || arrayLenght === 0) {
            console.log("Wrong optics coordinates.");
          } else {
            if (arrayLenght <= 2) {
              console.log("need more points.");
            } else {
              let i = 0;
              while (i < arrayLenght) {
                opticsCoordinates.push(
                  new Array(
                    formCoordinatesArray[i],
                    formCoordinatesArray[i + 1]
                  )
                );
                i++;
                i++;
              }
              this.addOptics({
                address: this.refs.addressFormField.value,
                locationInfo: this.refs.locationInfoFormField.value,
                ipAddress: this.refs.ipAddressFormField.value,
                info: this.refs.infoFormField.value,
                coordinates: opticsCoordinates,
              });
            }
          }

          break;
        default:
          console.log("Default case");
      }

      this.setState({
        currentForm: null,
      });
    }
  };

  handleAddButton(itemType, formType) {
    this.setState({
      featureInfo: {
        featureCoordinates: null,
        address: null,
        ipAddress: null,
        info: null,
        locationInfo: null,
      },
      formItemType: itemType,
      currentForm: formType,
    });
  }

  getEditingOrAddingForm() {
    if (this.state.currentForm === "add") {
      return (
        <div className="formContainer">
          <div className="addForm">
            <div>{this.state.currentForm}</div>
            <textarea
              className="formField"
              ref="coordinateFormField"
              placeholder="coordinates"
              defaultValue={this.state.coordinates}
            ></textarea>
            <textarea
              className="formField"
              ref="addressFormField"
              placeholder="address"
            ></textarea>
            <textarea
              className="formField"
              ref="ipAddressFormField"
              placeholder="ip address"
            ></textarea>
            <textarea
              className="formField"
              ref="locationInfoFormField"
              placeholder="location info"
            ></textarea>
            <textarea
              className="formField"
              ref="infoFormField"
              placeholder="additional info"
            ></textarea>
            <div className="formButtonsContainer">
              <button
                type="button"
                onClick={() => {
                  this.handleAddSubmit(this.state.formItemType);
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => this.setState({ currentForm: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.currentForm === "edit") {
      return (
        <div className="formContainer">
          <div className="editForm">
            <div>{this.state.currentForm}</div>
            <textarea
              className="formField"
              ref="coordinateFormField"
              defaultValue={this.state.featureInfo.featureCoordinates}
              style={{ backgroundColor: "lightgray" }}
              readOnly
            ></textarea>
            <textarea
              className="formField"
              ref="addressFormField"
              placeholder="address"
              defaultValue={this.state.featureInfo.address}
            ></textarea>
            <textarea
              className="formField"
              ref="ipAddressFormField"
              placeholder="ip address"
              defaultValue={this.state.featureInfo.ipAddress}
            ></textarea>
            <textarea
              className="formField"
              ref="locationInfoFormField"
              placeholder="location info"
              defaultValue={this.state.featureInfo.locationInfo}
            ></textarea>
            <textarea
              className="formField"
              ref="infoFormField"
              placeholder="additional info"
              defaultValue={this.state.featureInfo.info}
            ></textarea>
            <div className="formButtonsContainer">
              <button
                type="button"
                onClick={() => {
                  this.handleDeleteButton();
                  this.setState({
                    currentForm: null,
                  });
                }}
              >
                Delete
              </button>
              <button type="button" onClick={() => this.handleEditSubmit()}>
                Submit
              </button>
              <button
                type="button"
                onClick={() => this.setState({ currentForm: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="opticMapComponent">
        <div className="leftMapPanel">
          <div className="coordinateString" id="coordinateString">
            {this.state.coordinates}
          </div>

          <div className="objectButtons">
            <div className="featureInfoAddControls">
              <div
                className="objectButton"
                onClick={this.setSwitchesToRightControlPanel}
              >
                switches
              </div>
              <div
                className="addFeatureButton"
                onClick={() => {
                  this.handleAddButton("switch", "add");
                }}
              >
                add
              </div>
            </div>
            <div className="featureInfoAddControls">
              <div
                className="objectButton"
                onClick={this.setOpticsToRightControlPanel}
              >
                optic cable
              </div>
              <div
                className="addFeatureButton"
                onClick={() => {
                  this.handleAddButton("opticCable", "add");
                }}
              >
                add
              </div>
            </div>
            <div className="featureInfoAddControls">
              <div
                className="objectButton"
                onClick={this.setClientStationsToRightControlPanel}
              >
                client stations
              </div>
              <div
                className="addFeatureButton"
                onClick={() => {
                  this.handleAddButton("clientStation", "add");
                }}
              >
                add
              </div>
            </div>
          </div>
          {this.getfeatureInfoBlock()}
          {this.getEditingOrAddingForm()}
        </div>
        <div className="mapContainer" ref="mapContainer"></div>
        <div className="rightMapPanel">
          <div className="displayedFeatures">
            {this.state.displayedFeatures !== null ? (
              this.state.displayedFeatures.map((feature) => {
                return (
                  <li
                    className="displayedFeature"
                    key={feature.getProperties().featureCoordinates}
                    onClick={this.handleRightPanelItemClick.bind(this, feature)}
                  >
                    {feature.getProperties().address}
                  </li>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default OpticMap;

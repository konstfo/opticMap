const express = require("express");
const fs = require("fs");
const { Console } = require("console");
const app = express();

app.use(express.json());

//
//switches
app.get("/api/switches", (req, res) => {
  fs.readFile("res/switches.json", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/addSwitch", (req, res) => {
  console.log("add switch");
  addNewItem("res/switches.json", req.body);
});

app.post("/api/deleteSwitch", (req, res) => {
  console.log("delete switch request");
  deleteItem("res/switches.json", req.body);
});

app.post("/api/editSwitch", (req, res) => {
  console.log("edit switch request");
  console.log(req.body);
  editItem("res/switches.json", req.body);
});

//
//optics
app.get("/api/optics", (req, res) => {
  fs.readFile("res/optics.json", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/addOptics", (req, res) => {
  console.log("add optics");
  addNewItem("res/optics.json", req.body);
});

app.post("/api/deleteOptics", (req, res) => {
  console.log("delete optics request");
  deleteItem("res/optics.json", req.body);
});

app.post("/api/editOptics", (req, res) => {
  console.log("edit optics request");
  editItem("res/optics.json", req.body);
});

//
//client stations
app.get("/api/clientStations", (req, res) => {
  fs.readFile("res/clientStations.json", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/addClientStation", (req, res) => {
  console.log("add client station");
  addNewItem("res/clientStations.json", req.body);
});

app.post("/api/deleteClientStation", (req, res) => {
  console.log("delete client station request");
  deleteItem("res/clientStations.json", req.body);
});

app.post("/api/editClientStation", (req, res) => {
  console.log("edit client station request");
  editItem("res/clientStations.json", req.body);
});

function addNewItem(path, item_) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(
        "Problems with reading file while adding new item. Path: ",
        path,
        " item: ",
        item_
      );
    }
    var itemList = JSON.parse(data);

    var duplicationsExists = false;

    itemList.map((obj) => {
      if (
        obj.address.trim() === item_.address.trim() &&
        obj.ipAddress.trim() === item_.ipAddress.trim() &&
        obj.info.trim() === item_.info.trim() &&
        obj.locationInfo.trim() === item_.locationInfo.trim()
      ) {
        duplicationsExists = true;
      }
    });
    if (!duplicationsExists) {
      itemList.push(item_);

      fs.writeFile(path, JSON.stringify(itemList), (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Added new element to", path, item_);
      });
    } else {
      console.log("Duplications found, item not added!");
    }
  });
}

function deleteItem(path, item_) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(
        "Problems with reading file while delete item. Path: ",
        path,
        " item: ",
        item_
      );
    }

    var itemList = JSON.parse(data);

    itemList.map((obj) => {
      console.log("coordinates obj:", obj.coordinates);
      console.log("coordinates item:", item_.coordinates);

      if (
        obj.address.trim() === item_.address.trim() &&
        obj.ipAddress.trim() === item_.ipAddress.trim() &&
        obj.info.trim() === item_.info.trim() &&
        obj.locationInfo.trim() === item_.locationInfo.trim() &&
        JSON.stringify(obj.coordinates) === JSON.stringify(item_.coordinates)
      ) {
        itemList.splice(itemList.indexOf(obj), 1);
        console.log("Element deleted:", obj);
      }
    });

    fs.writeFile(path, JSON.stringify(itemList), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

function editItem(path, items_) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(
        "Problems with reading file while editing item. Path: ",
        path,
        " items: ",
        items_
      );
    }

    var duplicationsExists = false;

    var itemList = JSON.parse(data);
    var itemToReplace = items_[0];
    var newItem = items_[1];

    itemList.map((obj) => {
      if (
        obj.address === itemToReplace.address &&
        obj.ipAddress === itemToReplace.ipAddress &&
        obj.info === itemToReplace.info &&
        obj.locationInfo === itemToReplace.locationInfo
      ) {
        itemList.map((itm) => {
          if (
            itm.address.trim() === newItem.address.trim() &&
            itm.ipAddress.trim() === newItem.ipAddress.trim() &&
            itm.info.trim() === newItem.info.trim() &&
            itm.locationInfo.trim() === newItem.locationInfo.trim()
          ) {
            duplicationsExists = true;
          }
        });
        if (!duplicationsExists) {
          itemList.splice(itemList.indexOf(obj), 1);
          itemList.push(newItem);
        } else {
          console.log("Duplication found, editing canceled.");
        }
      }
    });
    fs.writeFile(path, JSON.stringify(itemList), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

const port = 5000;

app.listen(port, () => console.log(`server started on port ${port}`));

import QtQuick 2.5
import QtQuick.Window 2.2
import "game.js" as Logic

Window {
    id: mainWindow
    visible: true

    property int stepInterval: 250

    property int fieldSize: 10
    property int gameSize: 20

//    Snake {
//        id: snake

//        Timer {
//            interval: stepInterval
//            repeat: true
//            onTriggered: { Logic.step() }
//        }
//    }

    Rectangle {
        id: apple
        objectName: "apple"

        width: parent.fieldSize
        height: width
        radius: 2
        x: 3
        y: 3

        color: "red"

        Timer {
            interval: 0
            repeat: false
            onTriggered: { Logic.placeApple(this) }
        }
    }
}

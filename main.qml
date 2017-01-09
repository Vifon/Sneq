import QtQuick 2.5
import QtQuick.Window 2.2
import "game.js" as Logic

Window {
    id: mainWindow
    visible: true

    property int stepInterval: 100

    Rectangle {
        id: gameArea

        width: Math.min(
                   mainWindow.width,
                   mainWindow.height)
        height: width

        border.color: "red"
        border.width: 2
        anchors.centerIn: parent

        property int fieldSize: width / gameSize
        property int gameSize: 20
    }

    Component.onCompleted: { Logic.initialize() }

    Timer {
        id: stepTimer
        running: true
        interval: stepInterval
        repeat: true
        onTriggered: { Logic.step() }
    }

    Item {
        focus: true

        Keys.onPressed: {
            Logic.onPressed(event)
        }
    }

    Text {
        id: score

        text: points * multiplier

        property int multiplier: 5
        property int points: 5

        x: 10
        y: 10
        z: 1
    }
}

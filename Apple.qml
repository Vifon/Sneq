import QtQuick 2.0

Rectangle {
    id: apple

    property int size: parent.fieldSize

    property int x_pos: 0
    property int y_pos: 0

    x: size * x_pos
    y: size * y_pos

    width: size
    height: size
    radius: width * 0.25
    color: "red"
}

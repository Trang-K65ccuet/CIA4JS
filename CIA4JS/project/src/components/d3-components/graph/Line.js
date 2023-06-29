import Utils from '../../utils/BasicUltils'

export default class Line {
    constructor(source, destination) {
        this.source = source;
        this.destination = destination;
    }

    updateLine(padding = 0) {
        let line = Utils.findPathForView(this, padding);
        this.begin = line.begin;
        this.end = line.end;
    }
}
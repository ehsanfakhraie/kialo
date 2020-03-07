import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import OrgChart from '../../libs/orgchart'
import { Row, Container, Col } from 'reactstrap';


import { addClaim ,selectClaim,updateClaims} from "../../actions/claims";

import { connect } from "react-redux";
import PropTypes from "prop-types";



class CChart extends Component {

    static propTypes = {
        claims:PropTypes.array.isRequired,
        selectClaim:PropTypes.func.isRequired,
        updateClaims:PropTypes.func.isRequired
    };


    constructor(props) {

        super(props);
        this.state = {
            id: 0, discussion: {
                claims: []
            }
        };

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        this.props.updateClaims(data(this.props.discussion.claims))
        return <Container >
            <div id="chart-container" ref="chart-container" >
            </div>
        </Container>;
    }



    componentDidMount() {
        processChart(this.props.discussion, this)



        const nod=ReactDOM.findDOMNode(this)
        console.log(nod.getElementsByClassName('node'))

    }


    handleClick(e) {
        console.log('sss',e.target)
        this.props.selectClaim(parseInt(e.target.id))
    }
}

function data(claims) {
    var children = claims.map(claim => ({ 'id': claim.id, 'text': claim.text,
        'className': className(claim.type),
        'parentid': claim.parent,
        'type':claim.type }));
    //var children = claims.map(claim => ({ 'id': claim.id, 'parentid': claim.parent }));
    var tree = unflatten(children);

    return unflatten(children)[0]
}
function className(type){
    if(type==1) return "pros"
    if(type==2) return "cons"
    if(type==0) return "none"
}


function processChart(discussion, nodeC) {
    console.log('hi')
    let datascource = data(discussion.claims)
        , orgchart = new OrgChart({
        'chartContainer': '#chart-container',
        'data': datascource,
        'depth': 2,
        'parentNodeSymbol': null, 'toggleSiblingsResp': false,
        'createNode': function (node, data) {
            console.log(data.id,datascource)
            node.addEventListener('click',nodeC.handleClick)

        }
    });


    // console.log(orgchart.getRelatedNodes(1,"children"))
    // return orgchart.getRelatedNodes(0,"children")

}



function unflatten(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }


    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentid) {
                mappedArr[mappedElem['parentid']]['children'].push(mappedElem);

            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    for (var id in mappedArr) {
        mappedElem = mappedArr[id];
        if (mappedElem['children'].length == 0) {
            delete mappedArr[id]['children']
        }
    }
    sortNodesAndChildren(tree)
    return tree;
}


function sortNodesAndChildren(nodes) {
    nodes.sort(function (a, b) {
        if (a.type > b.type) {
            return 1;
        }
        if (b.type > a.type) {
            return -1;
        }
        return 0;
    })
    nodes.forEach(function (node) {
        try {
            if (node.children.length!=0) {
                sortNodesAndChildren(node.children);
            }
        }
        catch (e) {
            // statements to handle any exceptions

        }

    })
}



const mapStateToProps = state => ({
    selectedClaim:state.claims.selectedClaim
});


export default connect(
    mapStateToProps,
    { addClaim ,selectClaim,updateClaims}
)(CChart);

//export default CChart
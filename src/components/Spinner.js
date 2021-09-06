import React from 'react'
import { Loader,Dimmer } from 'semantic-ui-react'

/**
* @author
* @function Spinner
**/

const Spinner = (props) => {
    return (
       
        <Dimmer active>
            <Loader size="huge" color="violet" content={"Preparing Chat..."} />
        </Dimmer>
        
    )

}

export default Spinner
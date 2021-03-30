import React from 'react';


class Footer extends React.Component {
    


    render() {
        
        return (
            <> 
            <footer id="sticky-footer" class="py-4 bg-dark text-white-50 w-100" style={{bottom:0, position:""}}>
            <div class="container text-center">
              <small>Copyright &copy; </small><a href="http://gozar.team">GozarTeam</a>
            </div>
          </footer>
          {/* <div className="w-100" style={{bottom:0, position:"fixed", marginTop:100}}>
                <div className="align-items-center  w-100" style={{ backgroundColor:'#3f51b5'}}>
                  <div className='text-center' style={{height: 80}}>
                    <p style={{color: 'white'}}>
                      @ساخته شده از کیالو
                    </p>
                  </div>
                </div>
              </div>  */}
            </>
        );

    }
}



export default (Footer);

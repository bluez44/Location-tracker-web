import "../styles/notfound.css";

function NotFound() {
  return (
    <section className="page_404 h-full flex items-end">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg h-[400px]">
                <h1 className="text-center mb-7">No location found</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;

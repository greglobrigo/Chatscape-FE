

export default function LeftSideBar() {
    return (
        <div id="l-sidebar" className="hidden md:flex md:flex-col md:min-w-[100px] lg:w-2/6 bg-gray-300 h-[90vh]">


            <div className="w-2/5 border-l-2 px-5">
                <div className="flex flex-col">
                    <div className="font-semibold text-xl py-4">Mern Stack Group</div>
                    <img
                        src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                        className="object-cover rounded-xl h-64"
                        alt=""
                    />
                    <div className="font-semibold py-4">Created 22 Sep 2021</div>
                    <div className="font-light">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
                        perspiciatis!
                    </div>
                </div>
            </div>
        </div>
    )
}

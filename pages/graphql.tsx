import { useState, useEffect } from "react";

const query = `{
  launchesPast(limit: 8) {
    mission_name
    launch_success
  }
}`;

const GraphQL = () => {
  const [spacexData, setSpacexData] = useState<[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.spacex.land/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setSpacexData(data.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(spacexData);
  }, [spacexData]);

  return (
    <div>
      <div className="flex flex-col">
        {/* {spacexData?.launchesPast?.map((mission) => (
          <span key={mission.mission_name}>{mission.mission_name}</span>
        ))} */}
      </div>
    </div>
  );
};

export default GraphQL;

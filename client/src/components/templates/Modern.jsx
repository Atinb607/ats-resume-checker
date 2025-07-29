const Modern = ({ data }) => (
  <div className="font-sans">
    <h1 className="text-3xl font-bold">{data.name}</h1>
    <p>{data.email} | {data.phone}</p>
    <hr className="my-2" />
    <h2 className="text-lg font-semibold mt-4">Education</h2>
    <p>{data.education}</p>
    <h2 className="text-lg font-semibold mt-4">Experience</h2>
    <p>{data.experience}</p>
    <h2 className="text-lg font-semibold mt-4">Skills</h2>
    <ul>
      {data.skills?.split(",").map((skill, i) => (
        <li key={i}>{skill.trim()}</li>
      ))}
    </ul>
  </div>
);

export default Modern;

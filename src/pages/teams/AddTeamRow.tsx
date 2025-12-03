import FolderIcon from "./FolderIcon";
import React, {useEffect, useState} from "react";
import "./AddTeamRow.css"

const Step1 = () => {
  return (
    <>
      Введи название
    </>
  )
}

const Step2 = ({onSelect}: { onSelect: (depth: number) => void }) => {

  const levels = [
    {label: 'Домен', depth: 0, id: "domen"},
    {label: 'Юр. лицо', depth: 1, id: "your face"},
    {label: 'Отдел/подразделение', depth: 2, id: "otdel"},
    {label: 'Группа', depth: 3, id: "group"},
  ];

  return (
    <>
      Выберите тип
      {levels.map((level) => (
        <label key={level.id} className="hint-step-2__teams-select-label">
          <input type="radio" name="level" value={level.id} onClick={() => onSelect(level.depth)}/>
          <FolderIcon depth={level.depth}/>
          {level.label}
        </label>
      ))}
    </>
  )
}

const Step3 = ({possibleTeams}: { possibleTeams: { label: string, depth: number, id: string }[] }) => {
  return (
    <>
      Выберите куда будет вложено
      {possibleTeams.map((team) => (
        <label key={team.id} className="hint-step-2__teams-select-label">
          <input type="radio" name="level" value={team.id}/>
          <FolderIcon depth={team.depth}/>
          {team.label}
        </label>
      ))}
    </>
  )
}

const AddTeamRow = () => {
  const [step, setStep] = useState(1);
  const [folderName, setFolderName] = useState('');
  const [folderType, setFolderType] = useState<number>();

  useEffect(() => {
    if (folderName.length == 0) {
      setStep(1);
      return;
    }
    if (folderType === undefined) {
      setStep(2);
      return;
    }
    setStep(3);
  }, [folderName, folderType]);

  useEffect(() => {
    console.log(step)
  }, [step]);

  return (
    <div className="teams-row">
      <div className="teams-row-left">
        <span className="teams-tree-empty"/>
        <FolderIcon depth={0}/>
        <div className="teams-tree-name">
          <input
            placeholder="Название"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            className="add-team-input"
          />

          <div className="step-hint">

            {step === 1 && <Step1/>}
            {step === 2 && <Step2 onSelect={setFolderType}/>}
            {step === 3 && <Step3 possibleTeams={[{label: "Основное", depth: 0, id: "2134"}]}/>}

            <div className="step-number">
              {Array.from({length: 3}).map((_, i) => {
                return (
                  <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" fill={i < step ? "#5D686B" : "#CED9DC"}/>
                  </svg>
                )
              })}
            </div>

          </div>
        </div>
      </div>

      <div className="teams-row-right">
        <span className="teams-metric">{0} сотрудника</span>
        <span className="teams-metric">{0} групп</span>
        <span className="teams-metric">{0} отдела</span>
        <span className="teams-metric">{0} юр. лиц</span>
        <span className="teams-metric">{0} домен</span>
      </div>
    </div>
  );
};


export default AddTeamRow;
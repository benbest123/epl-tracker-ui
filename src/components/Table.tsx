import type { Standing } from "../types/index.ts";

interface Props {
  standings: Standing[];
}

const Table = ({ standings }: Props) => {
  return (
    <div className='w-[340px] bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] border border-[#404040]'>
      <div className='bg-[#000080] text-white font-win95 text-base px-1 py-0.5 flex items-center justify-between select-none'>
        <span>Standings</span>
        <div className='flex gap-0.5'>
          <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
            _
          </button>
          <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
            □
          </button>
          <button className='font-win95 text-base bg-[#c0c0c0] border-none [box-shadow:var(--shadow-raised)] px-1.5 py-0 cursor-pointer text-black min-w-6 active:[box-shadow:var(--shadow-sunken)] disabled:text-[#808080] disabled:cursor-default'>
            ✕
          </button>
        </div>
      </div>
      <div className='p-2'>
        <div className='[box-shadow:var(--shadow-sunken)] bg-white p-1'>
          <table className='w-full border-collapse font-win95 text-base'>
            <thead>
              <tr>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-left'>#</th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-left' colSpan={2}>
                  Club
                </th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-right'>
                  <strong>Pts</strong>
                </th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-right'>W</th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-right'>D</th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-right'>L</th>
                <th className='bg-[#c0c0c0] [box-shadow:var(--shadow-raised)] px-2 py-0.5 text-right'>GD</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr key={s.team.id}>
                  <td className='px-2 py-0.5 border-b border-[#808080]'>{i + 1}</td>
                  <td className='px-2 py-0.5 border-b border-[#808080]'>
                    <img src={s.team.logo_url} alt={s.team.code} className='w-3.5 h-3.5' />
                  </td>
                  <td className='px-2 py-0.5 border-b border-[#808080]'>{s.team.code}</td>
                  <td className='px-2 py-0.5 border-b border-[#808080] text-right'>
                    <strong>{s.points}</strong>
                  </td>
                  <td className='px-2 py-0.5 border-b border-[#808080] text-right'>{s.won}</td>
                  <td className='px-2 py-0.5 border-b border-[#808080] text-right'>{s.drawn}</td>
                  <td className='px-2 py-0.5 border-b border-[#808080] text-right'>{s.lost}</td>
                  <td className='px-2 py-0.5 border-b border-[#808080] text-right'>{s.gd > 0 ? `+${s.gd}` : s.gd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;

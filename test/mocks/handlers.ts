import { http, HttpResponse } from 'msw';

const baseUrl = 'https://hapi.fhir.org/baseR4';

export const handlers = [
  // GET Encounters
  http.get(`${baseUrl}/Encounter`, ({ request }) => {
    const url = new URL(request.url);
    const count = parseInt(url.searchParams.get('_count') || '50');
    const page = parseInt(url.searchParams.get('_page') || '1');
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');

    // Generate mock encounters
    const encounters = Array.from({ length: count }, (_, i) => ({
      resource: {
        id: `encounter-${page}-${i + 1}`,
        resourceType: 'Encounter',
        status:
          status ||
          ['planned', 'arrived', 'triaged', 'in-progress', 'finished'][i % 5],
        class: { code: 'AMB', display: 'Ambulatory' },
        subject: { reference: `Patient/patient-${i + 1}` },
        period: {
          start: date || '2024-01-01T10:00:00Z',
          end: '2024-01-01T11:00:00Z',
        },
        participant: [
          {
            individual: { reference: `Practitioner/practitioner-${i + 1}` },
            type: [{ code: 'ATND', display: 'Attending' }],
          },
        ],
      },
    }));

    return HttpResponse.json({
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1000,
      entry: encounters,
    });
  }),

  // GET Patient
  http.get(`${baseUrl}/Patient/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id,
      resourceType: 'Patient',
      name: [{ text: `Patient ${id}` }],
      gender: 'male',
      birthDate: '1990-01-01',
    });
  }),

  // GET Practitioner
  http.get(`${baseUrl}/Practitioner/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id,
      resourceType: 'Practitioner',
      name: [{ text: `Dr. ${id}` }],
      qualification: [
        {
          code: { coding: [{ code: 'MD', display: 'Medical Doctor' }] },
        },
      ],
    });
  }),

  // GET Organization
  http.get(`${baseUrl}/Organization/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id,
      resourceType: 'Organization',
      name: `Hospital ${id}`,
      type: [{ coding: [{ code: 'prov', display: 'Healthcare Provider' }] }],
    });
  }),
];

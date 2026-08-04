import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

export interface ProjectPreviewMetadata {
  previewTitle: string;
  previewDescription: string;
  previewImage: string;
  favicon: string;
  domain: string;
}

interface MicrolinkAsset {
  url?: string;
}

interface MicrolinkResponse {
  status?: string;
  data?: {
    title?: string;
    description?: string;
    image?: MicrolinkAsset;
    logo?: MicrolinkAsset;
    screenshot?: MicrolinkAsset;
    url?: string;
  };
  message?: string;
}

@Injectable()
export class ProjectPreviewService {
  private readonly logger = new Logger(ProjectPreviewService.name);
  private readonly endpoint = 'https://api.microlink.io';

  async fetch(url: string): Promise<ProjectPreviewMetadata> {
    const normalizedUrl = this.normalizeUrl(url);
    const target = new URL(this.endpoint);

    target.searchParams.set('url', normalizedUrl.href);
    target.searchParams.set('screenshot', 'true');

    try {
      const response = await fetch(target, {
        headers: this.headers(),
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) {
        throw new Error(`Microlink responded with ${response.status}`);
      }

      const payload = (await response.json()) as MicrolinkResponse;

      if (payload.status !== 'success' || !payload.data) {
        throw new Error(payload.message || 'Microlink could not create a preview');
      }

      const data = payload.data;
      const domain = this.domainFrom(data.url || normalizedUrl.href);
      const favicon = data.logo?.url || this.fallbackFavicon(domain);

      return {
        previewTitle: data.title || domain,
        previewDescription: data.description || '',
        previewImage: data.screenshot?.url || data.image?.url || '',
        favicon,
        domain,
      };
    } catch (error) {
      this.logger.warn(
        `Unable to fetch Microlink preview for ${normalizedUrl.href}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      throw new HttpException(
        'Unable to generate website preview.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async tryFetch(url?: string): Promise<ProjectPreviewMetadata | null> {
    if (!url?.trim()) {
      return null;
    }

    try {
      return await this.fetch(url);
    } catch {
      return null;
    }
  }

  empty(): ProjectPreviewMetadata {
    return {
      previewTitle: '',
      previewDescription: '',
      previewImage: '',
      favicon: '',
      domain: '',
    };
  }

  private normalizeUrl(value: string): URL {
    try {
      const url = new URL(value.trim());

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Unsupported protocol');
      }

      return url;
    } catch {
      throw new HttpException(
        'Please provide a valid website URL.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private domainFrom(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  private fallbackFavicon(domain: string): string {
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
  }

  private headers(): HeadersInit {
    const apiKey = process.env.MICROLINK_API_KEY;

    return apiKey ? { 'x-api-key': apiKey } : {};
  }
}
